export const uploadMediaToCloudinary = async (asset) => {
    const cloudName = "dm7ybsxjh";
    const uploadPreset = "twins_preset";

    const isVideo = asset.type?.includes("video");

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? "video" : "image"}/upload`;

    const formData = new FormData();
    formData.append("file", {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName || `upload.${isVideo ? "mp4" : "jpg"}`
    });
    formData.append("upload_preset", uploadPreset);

    try {
        const res = await fetch(uploadUrl, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!data.secure_url) {
            console.log("Cloudinary error:", data);
            return null;
        }

        return data.secure_url;

    } catch (error) {
        console.log("Cloudinary upload error:", error);
        return null;
    }
};
