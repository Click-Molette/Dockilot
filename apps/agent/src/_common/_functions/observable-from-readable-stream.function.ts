import { Observable, finalize, fromEvent } from "rxjs"

export function observableFromReadableStream(readableStream) {
  return new Observable(observer => {
    // Écoute l'événement 'data'
    const dataSubscription = fromEvent(readableStream, 'data').subscribe({
      next: (chunk) => observer.next(chunk),
      error: (err) => observer.error(err)
    });

    // Écoute l'événement 'end'
    const endSubscription = fromEvent(readableStream, 'end').subscribe({
      next: () => {
        console.log('end');
        observer.complete();
        cleanup();
      }
    });

    // Écoute l'événement 'close'
    const closeSubscription = fromEvent(readableStream, 'close').subscribe({
      next: () => {
        console.log('close');
        observer.complete();
        cleanup();
      }
    });

    // Fonction de nettoyage
    function cleanup() {
      console.log('cleanup');
      dataSubscription.unsubscribe();
      endSubscription.unsubscribe();
      closeSubscription.unsubscribe();
    }

    // Retourne une fonction de désinscription pour nettoyer les abonnements
    return cleanup;
  }).pipe(
    finalize(() => {
      console.log('destroy');
      readableStream.destroy(); // Ferme le flux si nécessaire
    })
  );
}
