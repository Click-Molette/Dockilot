export function useFormatters() {
  const bytesToSize = (bytes: number) => {
    const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    let l = 0
    while (bytes >= 1024 && ++l) {
      bytes = bytes / 1024;
    }

    return (bytes.toFixed(bytes < 10 && l > 0 ? 1 : 0) + ' ' + units[l])
  }

  return {
    bytesToSize,
  }
}
