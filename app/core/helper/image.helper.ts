export async function reduceSize(file: File, width: number = 800) {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    return new Promise(resolve => {
        img.onload = () => {
            const MAX_WIDTH = width;
            const canvas = document.createElement('canvas');
            const scaleSize = MAX_WIDTH / img.width;

            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(blob => {
                const resizedFile = new File([blob!], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                });
                resolve(resizedFile);
            }, file.type);
        };
    });
}
