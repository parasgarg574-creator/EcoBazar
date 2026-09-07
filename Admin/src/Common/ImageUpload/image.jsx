import React, { useRef, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
const ImageUpload = ({
  value = null,
  onChange,
  multiple = false,
  accept = "image/*",
  label = "Please upload images",
  disabled = false,
  required = false,
  error = "",
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (multiple) {
      const newImages = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setPreview((prev) => [...(prev || []), ...newImages]);
      onChange?.([...files]);
    } else {
      const file = files[0];

      const image = {
        file,
        url: URL.createObjectURL(file),
      };

      setPreview(image);
      onChange?.(file);
    }

    // Allow selecting the same image again
    e.target.value = "";
  };

  const removeImage = (index) => {
    if (multiple) {
      const updatedImages = preview.filter((_, i) => i !== index);

      setPreview(updatedImages);
      onChange?.(updatedImages.map((item) => item.file));
    } else {
      setPreview(null);
      onChange?.(null);
    }
  };

  return (
    <div>
      {/* Upload Button */}
      {(!preview || multiple) && (
        <label
          className={`block cursor-pointer text-gray-500 bg-white border border-dashed border-[#00358575]
          rounded-lg px-8 py-3 text-center
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleUpload}
          />
          <div className="flex items-center justify-center">
            <FiPlus className="text-2xl text-[#E4E7E9] me-2" />
            <span>{label}</span>
          </div>
        </label>
      )}
      {preview && (
        <div className="flex flex-wrap gap-3 mt-3">
          {multiple ? (
            preview.map((image, index) => (
              <div
                key={index}
                className="relative w-[100px] h-[100px]"
              >
                <img
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border"
                />

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white
                  rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="relative w-[100px] h-[100px]">
              <img
                src={preview.url || preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg border"
              />

              <button
                type="button"
                onClick={() => removeImage()}
                className="absolute -top-2 -right-2 bg-red-500 text-white
                rounded-full w-6 h-6 flex items-center justify-center"
              >
                <FiX size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Required Error */}
      {required && !preview && (
        <div className="text-red-500 text-sm mt-1">
          {error || "Image is required"}
        </div>
      )}

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};
export default ImageUpload;
