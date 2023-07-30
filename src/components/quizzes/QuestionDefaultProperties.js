import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toJsonObject } from "../../Utils";
import { fetchApiGet, fetchApiPost } from "../../Requests";

const QuestionDefaultProperties = ({ quiz, question, setQuestion }) => {
  const [name, setName] = useState(question.name);
  const [mark, setMark] = useState(question.mark);
  const [text, setText] = useState(question.text);
  const [imageId, setImageId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [updateTimeoutId, setUpdateTimeoutId] = useState(-1);
  const navigate = useNavigate();
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    fetchImagesFromServer();
  }, []);

  useEffect(() => {
    if (quiz.archived) {
      return;
    }

    if (updateTimeoutId) {
      clearTimeout(updateTimeoutId);
    }

    if (
      text === question.text &&
      name === question.name &&
      mark === question.mark
    ) {
      return;
    }

    let timeoutId = setTimeout(() => {
      let json = toJsonObject(question);
      json.questionId = question.id;
      json.mark = mark;
      json.name = name;
      json.text = text;

      fetchApiPost("question/edit", json, navigate).then(([response, json]) => {
        if (response.ok) {
          setQuestion(json.response);
        }
      });
    }, 500);

    setUpdateTimeoutId(timeoutId);
  }, [text, name, mark]);

  useEffect(() => {
    if (selectedImage) {
      sendImageToServer();
    }
  }, [selectedImage]);

  const handleImageSelection = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    // sendImageToServer();
  };
  const fetchImagesFromServer = async () => {
    try {
      const route = `question/image/get_from_question?questionId=${question.id}`;

      const [response, json] = await fetchApiGet(route, navigate);

      if (response.ok) {
        const decodedImages = json.response.map((image) => {
          const imageType = image.encodedImage.split(";")[0].split(":")[1];
          const imageData = atob(image.encodedImage.split(",")[1]);
          const bytes = new Uint8Array(imageData.length);
          for (let i = 0; i < imageData.length; i++) {
            bytes[i] = imageData.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: imageType });
          const imageUrl = URL.createObjectURL(blob);
          return {
            id: image.id,
            questionId: image.questionId,
            imageUrl: imageUrl,
          };
        });
        setImageList(decodedImages);
        console.log(json.response);
      } else {
        console.error("Error fetching images:", json);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const encodeImageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(image);
    });
  };

  const sendImageToServer = async () => {
    try {
      const encodedImage = await encodeImageToBase64(selectedImage);
      const requestBody = {
        questionId: question.id,
        encodedImage: encodedImage,
      };

      const [response, json] = await fetchApiPost(
        "question/image/add",
        requestBody,
        navigate
      );
      if (response.ok) {
        console.log("Image saved:", json);
        setUploaded(true);
        setImageId(json.response.id);
        console.log(response);
        console.log("id");
        console.log(json.response.id);
      } else {
        console.error("Error saving image:", json);
      }
    } catch (error) {
      console.error("Error encoding image:", error);
    }
  };

  const deleteImageFromServer = async () => {
    try {
      const requestBody = {
        imageId: imageId,
      };
      console.log(requestBody);
      const [response, json] = await fetchApiPost(
        "question/image/delete",
        requestBody,
        navigate
      );
      if (response.ok) {
        // Image successfully deleted from the server, you can handle the response here
        console.log("Image deleted:", json);
        setUploaded(false); // Set the uploaded state to false
        setSelectedImage(null);
      } else {
        // Error occurred while deleting the image, handle the error here
        console.error("Error deleting image:", json);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <>
      <div className="self-stretch flex flex-row items-center justify-start gap-[50px] text-darkgray">
        <div className="flex-1 flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start border-b-[1px] border-solid border-gray-100">
          <input
            className="flex-1 relative px-0.5 pt-px pb-1.5 text-lg text-gray-100 outline-none font-ibm-plex-sans"
            type="text"
            placeholder="Question name"
            value={name}
            onChange={(e) => {
              if (!quiz.archived) {
                setName(e.target.value);
              }
            }}
          />
        </div>
        <div className="box-border w-[180px] flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start border-b-[1px] border-solid border-gray-100">
          <input
            className="flex-1 relative px-0.5 pt-px pb-1.5 text-lg text-gray-100 outline-none font-ibm-plex-sans"
            type="number"
            placeholder="Question mark"
            value={mark}
            onChange={(e) => {
              if (!quiz.archived) {
                setMark(parseFloat(e.target.value));
              }
            }}
          />
        </div>
      </div>
      <div className="self-stretch flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start text-darkgray border-b-[1px] border-solid border-gray-100">
        <textarea
          className="flex-1 relative px-0.5 pt-px text-lg text-gray-100 outline-none font-ibm-plex-sans"
          type="text"
          placeholder="Question text"
          value={text}
          onChange={(e) => {
            if (!quiz.archived) {
              setText(e.target.value);
            }
          }}
        />
      </div>
      {/* <div>
        <label htmlFor="imageInput" className="text-darkgray ">
          <img
            className="relative w-7 h-7 mr-2 cursor-pointer"
            alt=""
            src="/clip2.svg"
          />
        </label>
        <input
          id="imageInput"
          hidden
          type="file"
          accept="image/*"
          onChange={handleImageSelection}
        />

        <span className="text-darkgray mr-7">Select an Image</span>

        {selectedImage && (
          <img
            src={imagePreviewUrl}
            alt="Image Preview"
            className="w-20 h-20 mr-2"
          />
        )}
        {imageList.map((image) => (
          <div key={image.id}>
            <img src={image.imageUrl} alt="Image" className="w-20 h-20 mr-2" />
            <button onClick={() => deleteImageFromServer(image.id)}>
              Delete
            </button>
          </div>
        ))}
        {uploaded ? (
          <button
            onClick={deleteImageFromServer}
            style={{
              background: "white",
              cursor: "pointer",
            }}
          >
            <img
              className="relative w-7 h-7 mr-2 cursor-pointer"
              alt="Delete Image"
              src="/deleteImage.png"
            />
          </button>
        ) : (
          // <button
          //   onClick={sendImageToServer}
          //   disabled={!selectedImage}
          //   style={{
          //     opacity: selectedImage ? 1 : 0.5,
          //     cursor: selectedImage ? "pointer" : "not-allowed",
          //     background: "white",
          //   }}
          // >
          //   <img
          //     className="relative w-7 h-7 mr-2 bg-transparent cursor-pointer"
          //     alt="Upload Image"
          //     src="/uploadImage.png"
          //   />
          //</button>
          <></>
        )}
      </div> */}
    </>
  );
};

export default QuestionDefaultProperties;
