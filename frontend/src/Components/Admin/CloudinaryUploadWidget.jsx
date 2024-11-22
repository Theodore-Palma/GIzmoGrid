import React, { useState } from 'react';
import { openUploadWidget } from '@cloudinary/widget';





const CloudinaryUploadWidget = ({ onUploadComplete }) => {
  const [images, setImages] = useState([]);

  const uploadWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dfqapplee',
        uploadPreset: 'y4zsglfn',
        multiple: true,
        folder: 'products',
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setImages((prev) => [...prev, result.info.secure_url]);
        }
      }
    );
    widget.open();
  };

  const handleAddProduct = () => {
    const newProduct = {
      name: 'Sample Product',
      description: 'Sample Description',
      price: 100,
      images,
      category: 'Sample Category',
    };
    onUploadComplete(newProduct);
  };

  return (
    <div>
      <button onClick={uploadWidget}>Upload Images</button>
      <button onClick={handleAddProduct}>Add Product</button>
      <div>
        {images.map((url, index) => (
          <img key={index} src={url} alt={`Uploaded ${index}`} style={{ width: 100, margin: 10 }} />
        ))}
      </div>
    </div>
  );
};

export default CloudinaryUploadWidget;
