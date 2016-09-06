//this is for indexOf support in all browsers including IE7 1nd 8
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {

        var k;

        // 1. Let o be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of o with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = o.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of o with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of o with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in o && o[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

function findAndRemoveFromArray(arr, elem) {
    var index = arr.indexOf(elem);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function removeOptions(selectbox) {
    var i;
    for (i = selectbox.options.length - 1; i >= 0; i--) {
        selectbox.remove(i);
    }
}

function searchSelectForText(selectEl, text) {
    var options = selectEl.options;
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        var optionText = option.text;
        var lowerOptionText = optionText.toLowerCase();
        var lowerText = text.toLowerCase();
        var regex = new RegExp("^" + text, "i");
        var match = optionText.match(regex);
        var contains = lowerOptionText.indexOf(lowerText) != -1;
        if (match || contains) {
            //option found!!!
            return option.value;
        }
    }
    //option text not found, so return a default value in this case, 1
    return 1;
}

function setSelectByText(dropDown, textToFind) {
    textToFind = textToFind.toLowerCase();
    for (var i = 0; i < dropDown.options.length; i++) {
        var optionText = dropDown.options[i].text.toLowerCase();
        if (optionText === textToFind) {
            dropDown.selectedIndex = i;
            break;
        }
    }
}

function getDBDateTimeString(dateObj) {
    var dd = dateObj.getDate();
    var mm = dateObj.getMonth() + 1; //January is 0!
    var yyyy = dateObj.getFullYear();
    var hrs = dateObj.getHours();
    var mins = dateObj.getMinutes();
    var secs = dateObj.getSeconds();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (hrs < 10) {
        hrs = '0' + hrs;
    }
    if (mins < 10) {
        mins = '0' + mins;
    }
    if (secs < 10) {
        secs = '0' + secs;
    }
    dateObj = yyyy + '-' + mm + '-' + dd + " " + hrs + ":" + mins + ":" + secs;
    return dateObj;
}

function getDateTimeString(dateObj) {
    var dd = dateObj.getDate();
    var mm = dateObj.getMonth() + 1; //January is 0!
    var yyyy = dateObj.getFullYear();
    var hrs = dateObj.getHours();
    var mins = dateObj.getMinutes();
    //var secs = dateObj.getSeconds();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (hrs < 10) {
        hrs = '0' + hrs;
    }
    if (mins < 10) {
        mins = '0' + mins;
    }
    /*if (secs < 10) {
     secs = '0' + secs;
     }*/
    dateObj = dd + '-' + mm + '-' + yyyy + " / " + hrs + ":" + mins;
    return dateObj;
}

function getDateString(dateObj) {
    var dd = dateObj.getDate();
    var mm = dateObj.getMonth() + 1; //January is 0!
    var yyyy = dateObj.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    dateObj = yyyy + '-' + mm + '-' + dd;
    return dateObj;
}

function getTimeString(dateObj) {
    var hrs = dateObj.getHours();
    var mins = dateObj.getMinutes();
    //var secs = dateObj.getSeconds();

    if (hrs < 10) {
        hrs = '0' + hrs;
    }
    if (mins < 10) {
        mins = '0' + mins;
    }
    /*if (secs < 10) {
     secs = '0' + secs;
     }*/
    dateObj = hrs + ":" + mins;
    return dateObj;
}

function isDateObjectValid(dateObj) {
    if (Object.prototype.toString.call(dateObj) === "[object Date]") {
        // it is a date
        if (isNaN(dateObj.getTime())) {  // d.valueOf() could also work
            // date is not valid
            return false;
        }
        else {
            // date is valid
            return true;
        }
    }
    else {
        // not a date
        return false;
    }
}
function activateScrollToTopAndBottomButtons() {
    $('#scrollToBottom').bind("click", function () {
        $('html, body').animate({scrollTop: $(document).height()}, 500);
        return false;
    });
    $('#scrollToTop').bind("click", function () {
        $('html, body').animate({scrollTop: 0}, 500);
        return false;
    });
}
