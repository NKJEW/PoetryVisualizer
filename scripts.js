var lines = [""];
var rhymes = [];
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var rhymeColors = [];
var colorValNum = 0;
var colorValDenom = 1;

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
        var display = (lines[i] !== "") ? alphabet[rhymes[i]] : "";
        document.getElementById("rhymer-" + i).innerHTML = display;
        // document.getElementById("rhymer-" + i).style.color = "#" + getColor(rhymeColors[rhymes[i]]);
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
