import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";

type Props = {
  initialImageUrl: string;
};

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <h1>Infinite Cat Generator</h1>
      <button onClick={handleClick}>Look at another cat</button>
      <div className={styles.frame}>{loading || <img src={imageUrl} className={styles.img}/>}</div>
    </div>
  );

};
export default IndexPage;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

type Image = {
  url: string;
};

const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images: unknown = await res.json();
  //check if images is an Array
  if (!Array.isArray(images)) {
    throw new Error("Error fetching data");
  }
  const image: unknown = images[0];
  //checking if data is of Image type using type-guarding function
  if (!isImage(image)) {
    throw new Error("Error fetching data");
  }
  return image;
};

//type guarding function
const isImage = (value: unknown): value is Image => {
  if (!value || typeof value !== "object") {
    return false;
  }
  return "url" in value && typeof value.url === "string";
};