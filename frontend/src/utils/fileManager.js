import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import firebase from "./firebaseConfig";

const storage = getStorage(firebase);

export const uploadFile = async (file, path) => {
  let storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const downloadFile = async (url) => {
  let httpsReference = ref(storage, url);
  getDownloadURL(httpsReference).then((url) => {
    axios({
      url,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      let url = window.URL.createObjectURL(new Blob([response.data]));
      let link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", httpsReference.name);
      document.body.appendChild(link);
      link.click();
    });
  });
};
