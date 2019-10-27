var lines = [""];
var rhymes = [];
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var lineTemplate = "<div class=\"line-container\"><input class=\"inputbox\" type=\"text\" oninput=\"dealWithKeyboard(#)\" onchange=\"dealWithEnd(#)\" autocomplete=\"off\" id=\"input-#\" placeholder=\". . .\"><p class=\"syllable-counter\" id=\"counter-#\">0</p><p class=\"rhymer\" id=\"rhymer-#\">0</p></div>";

function dealWithEnd(id) {
    updateLines();
    updateAllRhymes();
    document.getElementById("input-" + (id + 1)).focus();
}

function updateLines() {
    for (var i = 0; i < lines.length; i++) {
        lines[i] = document.getElementById("input-" + i).value;
    }

    if (lines[lines.length - 1] === "") {
        return;
    }

    lines.push("");
    var containedHTML = "";
    for (var i = 0; i < lines.length; i++) {
        containedHTML += lineTemplate.replace(/#/g, i);
    }
    document.getElementById("inputs").innerHTML = containedHTML;

    for (var i = 0; i < lines.length; i++) {
        document.getElementById("input-" + i).value = lines[i];
        updateSyllableCount(i);
    }
}

function dealWithKeyboard(id) {
    updateSyllableCount(id);
}

function updateRhymeDisplay() {
    for (var i = 0; i < lines.length; i++) {
        var display = (lines[i] !== "") ? rhymes[i] : "";
        document.getElementById("rhymer-" + i).innerHTML = display;
    }
}

function updateSyllableCount(id) {
    var totalSyllables = 0;
    var words = document.getElementById("input-" + id).value.split(' ');
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (word.trim() != "") {
            totalSyllables += RiTa.getSyllables(word).split('/').length;
        }
    }

    document.getElementById("counter-" + id).innerHTML = totalSyllables;
}

function updateAllRhymes() {
    rhymes = [];
    for (var i = 0; i < lines.length; i++) {
        updateLineRhyme(i);
    }

    updateRhymeDisplay();
}

function updateLineRhyme(id) {
    for (var i = 0; i < rhymes.length; i++) {
        if (RiTa.isRhyme(lines[id], lines[i])) {
            rhymes.push(rhymes[i]);
            return;
        }
    }
    rhymes.push(getNextRhyme());
}

function getNextRhyme() {
    if (rhymes.length == 0) {
        return alphabet.charAt(0);
    }
    var max = rhymes[0];
    for (var i = 0; i < rhymes.length; i++) {
        if (max < rhymes[i]) {
            max = rhymes[i];
        }
    }
    return alphabet.charAt(alphabet.indexOf(max) + 1);
}
