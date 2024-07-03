declare module 'quill-image-uploader' {
    import { Quill } from 'react-quill';

    interface ImageUploaderOptions {
        upload: (file: File) => Promise<string>;
    }

    class ImageUploader {
        constructor(quill: Quill, options: ImageUploaderOptions);
    }

    export default ImageUploader;
}
