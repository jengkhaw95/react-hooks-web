const { default: useSuggestionInput } = require("./hooks/useSuggestionInput");
const { default: useModal } = require("./hooks/useModal");

exports.printMsg = function () {
  console.log("This is a message from the demo package 123");
};

exports.useModal = useModal;
exports.useSuggestionInput = useSuggestionInput;
