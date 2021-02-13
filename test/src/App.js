import { useEffect, useState } from "react";
import "./App.css";

function useModal() {
  const [modalShown, setModalShown] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const setModal = (i = false) => {
    setModalShown(!modalShown);
    if (i) {
      setModalContent(i);
    }
  };

  return { modalShown, setModal, modalContent };
}

//function useAutoInput(suggestions = [], key = null) {
//  const [state, setState] = useState({
//    activeSuggestion: -1,
//    filteredSuggestions: [],
//    showSuggestions: false,
//    userInput: "",
//    selected: null,
//  });

//  const onChange = (e) => {
//    console.log("change");
//    const userInput = e.target.value;

//    const filteredSuggestions = suggestions.filter((suggestion) => {
//      if (!key) {
//        return suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1;
//      }
//      if (key instanceof Array) {
//        return (
//          key.filter((k) => suggestion[k].indexOf(userInput.toLowerCase()) > -1)
//            .length > 0
//        );
//      }
//      return false;
//    });

//    setState({
//      activeSuggestion: -1,
//      filteredSuggestions,
//      showSuggestions: true,
//      userInput,
//    });
//  };

//  const onClick = (e) => {
//    console.log("oops");

//    setState({
//      activeSuggestion: -1,
//      filteredSuggestions: [],
//      showSuggestions: false,
//      userInput: e.currentTarget.innerText,
//    });
//  };

//  const handleSelect = () => {
//    const { filteredSuggestions, activeSuggestion } = state;
//    if (filteredSuggestions.length === 0 || activeSuggestion === -1) {
//      return;
//    }
//    console.log(filteredSuggestions[activeSuggestion]);
//    setState({
//      userInput: "",
//      activeSuggestion: -1,
//      filteredSuggestions: [],
//      showSuggestions: false,
//    });
//  };

//  const onKeyDown = (e) => {
//    const { activeSuggestion, filteredSuggestions, showSuggestions } = state;

//    if (e.key === "Escape") {
//      setState({
//        ...state,
//        activeSuggestion: -1,
//        showSuggestions: false,
//        selected: null,
//      });
//    } else if (e.key === "ArrowUp") {
//      e.preventDefault();
//      if (!showSuggestions || filteredSuggestions.length === 0) {
//        return;
//      }
//      setState({
//        ...state,
//        selected:
//          activeSuggestion === 0
//            ? null
//            : activeSuggestion === -1
//            ? filteredSuggestions[filteredSuggestions.length - 1]
//            : filteredSuggestions[activeSuggestion-1],
//        userInput:
//          activeSuggestion === 0
//            ? state.userInput
//            : activeSuggestion === -1
//            ? filteredSuggestions[filteredSuggestions.length - 1]["name"]
//            : filteredSuggestions[activeSuggestion - 1]["name"],
//        activeSuggestion:
//          activeSuggestion === 0
//            ? -1
//            : activeSuggestion === -1
//            ? filteredSuggestions.length - 1
//            : activeSuggestion - 1,
//      });
//    }
//    // User pressed the down arrow, increment the index
//    else if (e.key === "ArrowDown") {
//      if (!showSuggestions || filteredSuggestions.length === 0) {
//        return;
//      }
//      setState({
//        ...state,
//        selected:
//          activeSuggestion === filteredSuggestions.length - 1
//            ? null
//            : filteredSuggestions[activeSuggestion + 1],
//        userInput:
//          activeSuggestion === filteredSuggestions.length - 1
//            ? state.userInput
//            : filteredSuggestions[activeSuggestion + 1]["name"],
//        activeSuggestion:
//          activeSuggestion === filteredSuggestions.length - 1
//            ? -1
//            : activeSuggestion + 1,
//      });
//    } else if (e.key === "Enter") {
//      if (!showSuggestions) {
//        return;
//      }
//      e.preventDefault();
//      handleSelect();
//    }
//  };
//  return { onChange, onClick, onKeyDown, state };
//}

function useAutoInput({ suggestions, keys = null }, cb) {
  const initialState = {
    activeSuggestion: -1,
    filteredSuggestions: [],
    showSuggestions: false,
    userInput: "",
  };
  const [state, setState] = useState(initialState);
  const { activeSuggestion, filteredSuggestions, showSuggestions } = state;

  //When user inputs
  const onChange = (e) => {
    const userInput = e.currentTarget.value;
    const filteredSuggestions = suggestions.filter((suggestion) => {
      if (suggestion instanceof String) {
        console.log(suggestion);
        return suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1;
      }
      if (suggestion instanceof Object && keys instanceof Array) {
        return (
          keys.filter(
            (k) => suggestion[k].indexOf(userInput.toLowerCase()) > -1
          ).length > 0
        );
      }
      return false;
    });

    setState({
      activeSuggestion: -1,
      filteredSuggestions,
      showSuggestions: true,
      userInput,
    });
  };

  // When user click on the selected
  const onClick = (e) => {
    const index = e.currentTarget.dataset.index;
    if (index) {
      cb(filteredSuggestions[index]);
    }
    resetSuggestion();
  };

  //When user navigate
  const onKeyDown = (e) => {
    switch (e.key) {
      case "Escape":
        resetSuggestion();
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!showSuggestions || filteredSuggestions.length === 0) {
          break;
        }

        previousSuggestion();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!showSuggestions || filteredSuggestions.length === 0) {
          break;
        }
        nextSuggestion();
        break;
      case "Enter":
        e.preventDefault();
        if (!showSuggestions || filteredSuggestions.length === 0) {
          break;
        }
        cb(filteredSuggestions[activeSuggestion]);
        break;
      default:
        break;
    }
  };

  const nextSuggestion = () => {
    if (
      activeSuggestion === -1 ||
      activeSuggestion === filteredSuggestions.length - 1
    ) {
      setState((s) => ({
        ...s,
        activeSuggestion: 0,
        userInput: s.filteredSuggestions[0]["suggestionName"],
      }));
    } else {
      setState((s) => ({
        ...s,
        activeSuggestion: s.activeSuggestion + 1,
        userInput:
          s.filteredSuggestions[s.activeSuggestion + 1]["suggestionName"],
      }));
    }
  };

  const previousSuggestion = () => {
    if (activeSuggestion <= 0) {
      setState((s) => ({
        ...s,
        activeSuggestion: s.filteredSuggestions.length - 1,
        userInput:
          s.filteredSuggestions[s.filteredSuggestions.length - 1][
            "suggestionName"
          ],
      }));
    } else {
      setState((s) => ({
        ...s,
        activeSuggestion: s.activeSuggestion - 1,
        userInput:
          s.filteredSuggestions[s.activeSuggestion - 1]["suggestionName"],
      }));
    }
  };
  const resetSuggestion = () => {
    setState(initialState);
  };

  return { onChange, onClick, onKeyDown, state };
}

function App() {
  const [a, as] = useState([]);
  const { onChange, onClick, onKeyDown, state } = useAutoInput(
    {
      suggestions: [
        { name: "abc", age: "111", suggestionName: "222" },
        { name: "aasfbc", age: "1r31", suggestionName: "sdq" },
        { name: "abfqc", age: "11w1", suggestionName: "222" },
      ],
      keys: ["name"],
    },
    (sel) => as((c) => [...c, sel])
  );
  const {
    activeSuggestion,
    filteredSuggestions,
    showSuggestions,
    userInput,
  } = state;
  const { modalShown, setModal, modalContent } = useModal();
  const YourModal = () => (
    <div>
      <h1>Modal Header</h1>
      <p>Modal Content</p>
    </div>
  );

  return (
    <div className="App">
      <button onClick={() => setModal(<YourModal />)}>Toggle Modal</button>
      {modalShown && modalContent}
      {/*<input
        type="text"
        value={a}
        onChange={(e) => {
          sa(e.target.value);
          console.log("out");
        }}
        onKeyDown={(e) => {
          console.log(e);
        }}
      />*/}
      <div>
        <input
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
        />
        <div>
          {showSuggestions && userInput ? (
            filteredSuggestions.length ? (
              <ul style={{ position: "absolute", zIndex: "10" }}>
                {filteredSuggestions.map((s, i) => (
                  <li
                    style={
                      i === activeSuggestion
                        ? { backgroundColor: "GrayText" }
                        : null
                    }
                    key={i}
                    data-index={i}
                    onClick={onClick}
                  >
                    <div>a</div>
                    {s.name}
                  </li>
                ))}
              </ul>
            ) : (
              <>No suggestions</>
            )
          ) : null}
        </div>
        <ul>
          {a.map((b) => (
            <li>{b.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
