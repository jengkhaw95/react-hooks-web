import { useState } from "react";

// This hook filters according to Object{suggestions[] & ?keys[]} and callback on selected (Enter/Click), with event listeners for input/mapped items
export default function useSuggestionInput({ suggestions, keys = null }, cb) {
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
        userInput: s.filteredSuggestions[0]["name"],
      }));
    } else {
      setState((s) => ({
        ...s,
        activeSuggestion: s.activeSuggestion + 1,
        userInput: s.filteredSuggestions[s.activeSuggestion + 1]["name"],
      }));
    }
  };

  const previousSuggestion = () => {
    if (activeSuggestion <= 0) {
      setState((s) => ({
        ...s,
        activeSuggestion: s.filteredSuggestions.length - 1,
        userInput:
          s.filteredSuggestions[s.filteredSuggestions.length - 1]["name"],
      }));
    } else {
      setState((s) => ({
        ...s,
        activeSuggestion: s.activeSuggestion - 1,
        userInput: s.filteredSuggestions[s.activeSuggestion - 1]["name"],
      }));
    }
  };
  const resetSuggestion = () => {
    setState(initialState);
  };

  return { onChange, onClick, onKeyDown, state };
}
