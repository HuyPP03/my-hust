import Image from "next/image";
import toast from "react-hot-toast";
import { storage } from "@/libs/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditableImage({ link, setLink }) {
  async function handleFileChange(e) {
    try {
      const file = e.target.files[0];
      const uploadPromise = new Promise(async (resolve, reject) => {
        // Upload avatar to Firebase Storage immediately
        const storageRef = ref(storage, `menuItems/${file.name}`);
        await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded avatar (optional)
        const avatarURL = await getDownloadURL(storageRef);
        if (avatarURL) {
          setLink(avatarURL);
          resolve();
        } else reject();
      });
      toast.promise(uploadPromise, {
        loading: "Uploading...",
        success: "Upload completed!",
        error: "Upload error!",
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {link && (
        <Image
          className="rounded-lg h-full mb-1 w-full"
          src={link}
          width={250}
          height={250}
          alt={"avatar"}
          priority={true}
        />
      )}
      {!link && (
        <div className="text-center bg-gray-200 p-4 text-gray-500 rounded-lg mb-1">
          No image
        </div>
      )}
      <label>
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer">
          Edit
        </span>
      </label>
    </>
  );
}
