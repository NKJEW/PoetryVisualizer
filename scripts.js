var lines = [""];
var rhymes = [];
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var rhymeColors = [];
var colorValNum = 0;
var colorValDenom = 1;

var lineTemplate = "<div class=\"line-container\"><input class=\"inputbox\" type=\"text\" onkeydown=\"dealWithKeyboard(#, event)\" autocomplete=\"off\" id=\"input-#\" placeholder=\". . .\"><p class=\"syllable-counter\" id=\"counter-#\">0</p><p class=\"rhymer\" id=\"rhymer-#\"></p></div>";

function dealWithEnd(id) {
    initLines();
    addLines(id);
    updateLines();
    updateAllRhymes();
    document.getElementById("input-" + Math.min(id + 1, lines.length - 1)).focus();
}

function initLines() {
    for (var i = 0; i < lines.length; i++) {
        lines[i] = document.getElementById("input-" + i).value;
    }
}

function addLines(id) {
    lines.splice(id + 1, 0, "");
}

function updateLines() {
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

function dealWithKeyboard(id, event) {
    if(event.keyCode == 13) {
        dealWithEnd(id);
        return;
    }

    if (lines.length > 1 && getInput(id) === "" && event.keyCode == 8) {
        var nextLineId = Math.max(id - 1, 0);
        document.getElementById("input-" + nextLineId).readOnly = true;
        deleteLine(id);
        return;
    }
    updateSyllableCount(id);
}

function getInput(id) {
    return document.getElementById("input-" + id).value;
}

function deleteLine(id) {
    lines.splice(id, 1);
    rhymes.splice(id, 1);

    updateLines();
    updateAllRhymes();

    var nextLineId = Math.max(id - 1, 0);
    var prevText = lines[nextLineId] + " ";
    document.getElementById("input-" + nextLineId).focus();
    document.getElementById("input-" + nextLineId).value = prevText;
}

function updateRhymeDisplay() {
    for (var i = 0; i < lines.length; i++) {
        var display = (lines[i] !== "") ? alphabet[rhymes[i]] : "";
        document.getElementById("rhymer-" + i).innerHTML = display;
        // document.getElementById("rhymer-" + i).style.color = "#" + getColor(rhymeColors[rhymes[i]]);
    }
}

function updateSyllableCount(id) {
    var totalSyllables = 0;
    var words = getInput(id).split(' ');
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
        curLastWord = lastWord(lines[id]);
        otherLastWord = lastWord(lines[i]);
        if (curLastWord.toLowerCase() === otherLastWord.toLowerCase() || RiTa.isRhyme(curLastWord, otherLastWord)) {
            rhymes.push(rhymes[i]);
            return;
        }
    }
    rhymes.push(getNextRhyme());
}

function lastWord(line) {
    var words = line.split(' ');
    return words[words.length - 1];
}

function getNextRhyme() {
    if (rhymes.length == 0) {
        return 0;
    }
    var max = rhymes[0];
    for (var i = 0; i < rhymes.length; i++) {
        if (max < rhymes[i]) {
            max = rhymes[i];
        }
    }

    rhymeColors.push(colorValNum / colorValDenom);
    colorValNum += 2;
    if (colorValNum >= colorValDenom) {
        colorValNum = 1;
        colorValDenom *= 2;
    }

    return max + 1;
}

function getColor(value) {
    r = Math.floor(clamp01(2 - (6 * (Math.abs(Math.round(value) - value)))) * 192);
    g = Math.floor(clamp01(2 - (6 * (Math.abs(Math.round(value + (2/3)) - (value + (2/3)))))) * 192);
    b = Math.floor(clamp01(2 - (6 * (Math.abs(Math.round(value + (1/3)) - (value + (1/3)))))) * 192);
    return (r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0'));
}

function clamp01(value) {
    return Math.min(Math.max(0, value), 1)
}
