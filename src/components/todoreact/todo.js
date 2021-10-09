import React, { useState, useEffect } from "react";
import "./style.css";

// get the localStorage data back
const getLocalData = () => {
  const lists = localStorage.getItem("mytodolist");
  // So, in the getItem I have to pass the Key:"mytodolist" which I passed in useEffect for using the Local Storage in String format.

  if (lists) {
    return JSON.parse(lists);
    // If your List is not empty / EXIST. I'm haveing the lists in Array formating. And using JS builtin function parse.
  } else {
    return [];
    // Else just return an empty array.
  }
};
// As we want the List to be there. ALthough we refresh the page.
// I'm getting the data from the Todo List and getting it stored in the Local Storage.

const Todo = () => {
  // Making useState Hooks for all the Necessary operations we want to do.

  const [inputdata, setInputData] = useState("");
  // The input box we created for adding the list we have for the day to be created. Intially it is EMPTY.

  const [items, setItems] = useState(getLocalData());
  // Items are the array of ALL the lists I have created and getting stored in the Local Storage. Intially I'm calling the abobe function.

  const [isEditItem, setIsEditItem] = useState("");
  // For updating the current list if we have made any spell erroes. Intially it is EMPTY.

  const [toggleButton, setToggleButton] = useState(false);
  // As soon as you click Edit icon, I want the PLUS to change to Edit icon. So, that user also knows now it's in edit mode.

  // adding the list fucnction
  const addItem = () => {
    // A Base case if you not filled anything in the input box.
    if (!inputdata) {
      alert("plz fill the data");
    }

    // This Else if, is IF you want to EDIT.
    else if (inputdata && toggleButton) {
      // So, if my inputdata EXIST and toggleButton is True.
      setItems(
        // Then use the setItems function from usestate above to set the lists.

        items.map((curElem) => {
          // And loop through entire items and as we have given UNIQUE ID to every list items.

          if (curElem.id === isEditItem) {
            // So, we are checking that if that ID which we clicked to edit is same or not.
            return { ...curElem, name: inputdata };
          }
          return curElem;
        })
      );

      // After Adding the data to the list. We want the input box to be cleared, edit iterm should be null. And PLUS icon should appear now.
      setInputData("");
      setIsEditItem(null);
      setToggleButton(false);
    }

    // Here we are justing adding a new ID called Date with Time in string format to the new List beign added.
    // To each list because in future we want them to edit if they want.
    else {
      const myNewInputData = {
        id: new Date().getTime().toString(),
        name: inputdata,
      };

      // At the end we want the set the items with new input values NOT TOUCHING THE PREVIOUS VALUES (...) OPERATOR.
      setItems([...items, myNewInputData]);
      setInputData("");
    }
  };

  // Edit the items if clicked.
  // So, this function is handling if the EDIT button is clicked.
  // As we need to know if list need to be edit so that we can get the intial value to he input box.
  // So, the reason I'm taking it's Index(ID) as an argument.
  const editItem = (index) => {
    const item_todo_edited = items.find((curElem) => {
      return curElem.id === index;
      // So, first need to FIND the Index of that list which needs to be edited.
      // Then we are using the JS function and comparing the ID coming while clicked if EQUAL to the ID stored in local storage.
    });

    // Then we want the Initial value of that list to come to the input box.
    setInputData(item_todo_edited.name);
    // We have Edit mode should be triggered.
    setIsEditItem(index);
    // With the PLUS icon replaced with the EDIT icon.
    setToggleButton(true);
  };

  // Deleting the selected items
  // So, this function is handling if the DELETE button is clicked.
  // In order to know which list should be deletd, the reason I'm taking it's Index(ID) as an argument.
  const deleteItem = (index) => {
    const updatedItems = items.filter((curElem) => {
      // Then I'm filtering the entire items and getting the only list which I want to delete by comparing ID coming while clicked if EQUAL to the ID stored in local storage.
      return curElem.id !== index;
      // THEN ONLY RETURN THE VALUES WHICH ID IS NOT MATCHED AND REMOVE THE LIST ITEM WHICH ID WAS MATCHED. :) Technique
    });
    setItems(updatedItems);
    // Then set the setItems to the new updatedItems we returned at the end.
  };

  // Removing all the elements
  const removeAll = () => {
    // Just set the setItems function to EMPTY array because it will intial the items array to be EMPTY. :) Easy.
    setItems([]);
  };

  // We want to have the lists, although we REFRESH the page. So, using LocalStorage
  // useEffect Hook is used because whenever your items array is being trigged ([items]) then we want this Hook to render as well.
  useEffect(() => {
    // So, in the localStorage we are setting our items to a key : value pair as instructed by the Browser.
    // Key(string) ->  mytodolist and Value(string) -> Items in an string format using JS function
    localStorage.setItem("mytodolist", JSON.stringify(items));
  }, [items]);

  return (
    <>
      <div className="main-div">
        <div className="child-div">
          <figure>
            <img src="./images/todo.svg" alt="todologo" />
            <figcaption>Add Your List Here ✌</figcaption>
          </figure>
          <div className="addItems">
            <input
              type="text"
              placeholder="✍ Add Item"
              className="form-control"
              value={inputdata}
              onChange={(event) => setInputData(event.target.value)}
              // Setting up the data added to the new list in the items array.
            />
            {/* This is for PLUS and EDIT icon */}
            {/* So, if the toggleButton is TRUE, put EDIT ICON and call addItem function */}
            {/* If the toggleButton is FALSE, put PLUS ICON and call addItem function */}
            {toggleButton ? (
              <i className="far fa-edit add-btn" onClick={addItem}></i>
            ) : (
              <i className="fa fa-plus add-btn" onClick={addItem}></i>
            )}
          </div>
          {/* Rendering our items*/}
          <div className="showItems">
            {items.map((curElem) => {
              // Using MAP because it will be continous.
              // Using curElem for getting all the field from the items array to display.
              return (
                <div className="eachItem" key={curElem.id}>
                  <h3>{curElem.name}</h3>
                  <div className="todo-btn">
                    <i
                      className="far fa-edit add-btn"
                      onClick={() => editItem(curElem.id)}
                      // IF EDIT icon is clicked, call editItem function().
                      // () => is used because we only want to call it Once and not to go in INFINITE Loop.
                    ></i>
                    <i
                      className="far fa-trash-alt add-btn"
                      onClick={() => deleteItem(curElem.id)}
                      // IF DELETE icon is clicked, call deleteItem function().
                      // () => is used because we only want to call it Once and not to go in INFINITE Loop.
                    ></i>
                  </div>
                </div>
              );
            })}
          </div>

          {/* remove all button  */}
          <div className="showItems">
            <button
              className="btn effect04"
              data-sm-link-text="Remove All"
              // This class is just for animation I added.
              onClick={removeAll}
              // IF this button icon is clicked, call removeAll function().
            >
              <span> CHECK LIST</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
