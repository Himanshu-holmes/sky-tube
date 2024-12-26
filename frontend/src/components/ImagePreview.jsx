import { Camera } from "lucide-react";
import React, { useState } from "react";
import { Controller } from "react-hook-form";

const ImagePreview = ({
  name,
  control,
  label,
  defaultValue = "",
  className,
  camerIcon = false,
  cameraSize = 20,
  image,
}) => {
  const [preview, setPreview] = useState(null);

  const handlePreview = (e) => {
    // e.preventDefault();

    const files = e.target.files;
    setPreview(URL.createObjectURL(files[0]));
    return files;
  };
  return (
    <div>
      <label
        className="relative mb-4 block cursor-pointer border border-dashed p-2 after:absolute after:inset-0 after:bg-transparent hover:after:bg-black/10"
        htmlFor={name}
      >
        {label && <label className="inline-block mb-2 pl-1">{label}</label>}
        {/* <input type="file" class="sr-only" id="thumbnail" /> */}
        <img src={preview || image} alt="image preview" className={className} />
        {camerIcon && (
          <Camera
            size={cameraSize}
            className="hover:text-purple-500  inline-flex justify-center items-center w-full"
          />
        )}

        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue || ""}
          render={({ field: { onChange } }) => (
            <input
              id={name}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                onChange(handlePreview(e));
              }}
            />
          )}
          rules={{ required: `${name} is required` }}
        />
      </label>
    </div>
  );
};

export default ImagePreview;
