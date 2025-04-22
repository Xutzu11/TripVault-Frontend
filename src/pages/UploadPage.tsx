// UploadPage.js
import axios from 'axios';
import {useState} from 'react';
import config from '../config.json';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState(null);

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        console.log('Upload button clicked');
        if (!file) return;
        console.log('File exists:', file);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post(
                `${config.SERVER_URL}/api/upload`,
                formData,
                {
                    headers: {'Content-Type': 'multipart/form-data'},
                },
            );
            console.log('Upload response:', response);
            setUploadedUrl(response.data.url);
        } catch (err) {
            console.log('Upload error:', err);
            alert('Upload failed');
        }
    };

    return (
        <div style={{padding: '2rem'}}>
            <h2>Upload a Photo</h2>
            <input type='file' accept='image/*' onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file}>
                Upload
            </button>

            {uploadedUrl && (
                <div style={{marginTop: '1rem'}}>
                    <p>✅ Uploaded to:</p>
                    <a
                        href={uploadedUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {uploadedUrl}
                    </a>
                    <br />
                    <img
                        src={uploadedUrl}
                        alt='Uploaded'
                        style={{maxWidth: '300px', marginTop: '1rem'}}
                    />
                </div>
            )}
        </div>
    );
};

export default UploadPage;
