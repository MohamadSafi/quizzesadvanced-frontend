import { confirmAlert } from "react-confirm-alert";
import { fetchApiPost } from "./Requests";

export function toJsonArray(array) {
  let temp = [];

  for (let element of array) {
    if (typeof element === 'object') {
      element = toJsonObject(element);
    } else if (Array.isArray(element)) {
      element = toJsonArray(element);
    }

    temp.push(element);
  }

  return temp;
}

export function toJsonObject(object, ignoreSubObjects = false) {
  let json = {};

  for (const key of Object.keys(object)) {

    let value = object[key];
    if (typeof value === "function") {
      continue;
    }

    if (ignoreSubObjects && value !== null && (Array.isArray(value) || typeof value === 'object')) {
      continue;
    }

    if (Array.isArray(value)) {
      value = toJsonArray(value);
    } else if (typeof value === 'object') {
      value = toJsonObject(value);
    }


    json[key] = value;
  }

  return json;
}

export function updateQuestionSetting(navigate, quiz, question, setQuestion, key) {
  return (newState) => {
    if (quiz.archived) {
      return;
    }

    if (question.meta[key] === newState) {
      return;
    }

    let json = toJsonObject(question);
    json.questionId = question.id;
    json.meta[key] = newState;

    fetchApiPost('question/edit', json, navigate)
      .then(([response, json]) => {
        if (response.ok) {
          setQuestion(json.response);  
        }
      });
  }
}

export function handleDeleteTemplate(quiz, question, setQuestion, navigate) {
  return () => {
    if (quiz.archived) {
      return;
    }

    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this question?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            fetchApiPost("question/delete", {
              questionId: question.id
            }, navigate);
            setQuestion({});
          },
        },
        {
          label: "No",
          onClick: () => {
            // Handle cancellation
          },
        },
      ],
    });
  };
}

export function download(text, name) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', name);

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function hasPermission(permissions, permission) {
  return permissions.includes('*') || permissions.includes(permission);
}
