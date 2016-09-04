function removeDuplicates() {
    var inp = document.getElementById("inputText").value;
    var inpArray = inp.split("\n");
    inpArray = inpArray.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
    });
    document.getElementById("outputText").value = inpArray.join("\n");
}