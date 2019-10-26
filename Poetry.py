import pronouncing
import string

punctuation_remover = str.maketrans('', '', string.punctuation)
p = pronouncing
lines = {}
rhymes = {}
alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

def get_syllables(line, id):
    lines[id] = line
    words = line.split()
    words = [word.strip().translate(punctuation_remover) for word in words] #removes punctuation
    phones = [p.phones_for_word(word) for word in words]
    return sum([p.syllable_count(phone[0]) for phone in phones if phone])

def get_rhyme(line, id):
    lines[id] = line
    rhymes.pop(id, 0)

    if not line:
        letter = next_rhyme_letter()
        rhymes[id] = letter
        return letter

    line_rhymes = p.rhymes(last_word(line))
    for key in lines.keys():
        if binary_search_word(line_rhymes, last_word(lines[key])):
            rhymes[id] = rhymes[key]
            return rhymes[id]

    letter = next_rhyme_letter()
    rhymes[id] = letter
    return letter

def binary_search_word(lst, word):
    if not lst:
        return False

    k = len(lst) // 2
    comp = lst[k]
    if word < comp:
        return binary_search_word(lst[:k], word)
    elif word > comp:
        return binary_search_word(lst[(k+1):], word)
    else:
        return True

def next_rhyme_letter():
    if not rhymes:
        return 'A'
    index = max([alphabet.index(letter) for letter in rhymes.values()]) + 1
    return alphabet[min(index, len(alphabet) - 1)]


def last_word(line):
    return line.split()[-1]
