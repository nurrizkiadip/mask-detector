export function indexOfMaxNumber(input) {
  const numbers = Array.from(input);

  if (!Array.isArray(numbers) || numbers.length === 0) {
    return -1;
  }

  const { index } = numbers.reduce((previousValue, currentValue, currentIndex) => {
    if (currentValue > previousValue.value) {
      return { value: currentValue, index: currentIndex };
    }

    return previousValue;
  }, { value: numbers[0], index: 0 });


  return index;
}

/**
 * Ref: https://stackoverflow.com/questions/18650168/convert-blob-to-base64
 */
export function convertBlobToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
