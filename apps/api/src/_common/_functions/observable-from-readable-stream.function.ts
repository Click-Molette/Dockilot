import { Observable, finalize, fromEvent } from "rxjs"

export function observableFromReadableStream(readableStream, sseConnection) {
  return new Observable(observer => {
    // Écoute l'événement 'data'
    const dataSubscription = fromEvent(readableStream, 'data').subscribe({
      next: (chunk) => observer.next(chunk),
      error: (err) => observer.error(err)
    });

    // Écoute l'événement 'end'
    const endSubscription = fromEvent(readableStream, 'end').subscribe({
      next: () => {
        observer.complete();
        cleanup();
      }
    });

    // Écoute l'événement 'close'
    const closeSubscription = fromEvent(readableStream, 'close').subscribe({
      next: () => {
        observer.complete();
        cleanup();
      }
    });

    // Écoute l'événement 'error'
    const errorSubscription = fromEvent(readableStream, 'error').subscribe({
      next: (err) => {
        observer.error(err);
        cleanup();
      }
    });

    // Observable qui émet lorsque la connexion SSE est fermée
    const sseClose$ = fromEvent(sseConnection, 'close');

    // Fonction de nettoyage
    function cleanup() {
      dataSubscription.unsubscribe();
      endSubscription.unsubscribe();
      closeSubscription.unsubscribe();
      errorSubscription.unsubscribe();
      readableStream.destroy(); // Ferme le flux si nécessaire
    }

    // Retourne une fonction de désinscription pour nettoyer les abonnements
    return cleanup;
  }).pipe(
    takeUntil(sseClose$), // Arrête l'Observable lorsque la connexion SSE est fermée
    finalize(() => {
      readableStream.destroy(); // Ferme le flux si nécessaire
    })
  );
}
