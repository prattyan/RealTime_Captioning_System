export type SimplificationLevel = 'none' | 'basic' | 'advanced';

export class TextSimplificationService {
  private complexWords: Record<string, string> = {
    'approximately': 'about',
    'consequently': 'so',
    'demonstrate': 'show',
    'facilitate': 'help',
    'implement': 'use',
    'immediately': 'now',
    'insufficient': 'not enough',
    'necessary': 'needed',
    'previously': 'before',
    'purchase': 'buy',
    'regarding': 'about',
    'subsequently': 'later',
    'utilize': 'use',
    'equivalent': 'equal',
    'additional': 'more',
    'assistance': 'help',
    'commence': 'start',
    'terminate': 'end',
    'endeavor': 'try',
    'obtain': 'get',
    'provide': 'give',
    'require': 'need',
    'sufficient': 'enough',
    'attempt': 'try',
    'locate': 'find',
    'inform': 'tell',
    'permit': 'allow',
    'retain': 'keep',
    'ascertain': 'find out',
    'collaborate': 'work together',
    'comprehend': 'understand',
    'encounter': 'meet',
    'establish': 'set up',
    'investigate': 'look into',
    'participate': 'take part',
    'accompany': 'go with',
    'anticipate': 'expect',
    'communicate': 'talk',
    'contribute': 'give',
    'distribute': 'give out',
    'eliminate': 'remove',
    'emphasize': 'stress',
    'transform': 'change'
  };

  private hindiSimplifications: Record<string, string> = {
    'संभवतः': 'शायद',
    'अत्यधिक': 'बहुत',
    'प्रदर्शित': 'दिखाना',
    'सहायता': 'मदद',
    'आवश्यक': 'ज़रूरी',
    'तत्काल': 'अभी',
    'पूर्व': 'पहले',
    'क्रय': 'खरीदना',
    'उपयोग': 'इस्तेमाल',
    'प्राप्त': 'पाना',
    'सूचित': 'बताना',
    'स्थापित': 'बनाना',
    'परिवर्तन': 'बदलाव'
  };

  public simplifyText(text: string, level: SimplificationLevel, language: string = 'en'): string {
    if (level === 'none') {
      return text;
    }

    let simplifiedText = text;

    if (language === 'en') {
      simplifiedText = this.simplifyEnglish(text, level);
    } else if (language === 'hi') {
      simplifiedText = this.simplifyHindi(text, level);
    } else {
      simplifiedText = this.applyGeneralSimplification(text, level);
    }

    return simplifiedText;
  }

  private simplifyEnglish(text: string, level: SimplificationLevel): string {
    let result = text;

    const words = result.split(/\b/);
    result = words.map(word => {
      const lowerWord = word.toLowerCase();
      if (this.complexWords[lowerWord]) {
        return this.preserveCase(word, this.complexWords[lowerWord]);
      }
      return word;
    }).join('');

    if (level === 'advanced') {
      result = this.breakDownSentences(result);
      result = this.removePassiveVoice(result);
      result = this.simplifyNumbers(result);
    }

    return result;
  }

  private simplifyHindi(text: string, level: SimplificationLevel): string {
    let result = text;

    for (const [complex, simple] of Object.entries(this.hindiSimplifications)) {
      const regex = new RegExp(complex, 'g');
      result = result.replace(regex, simple);
    }

    if (level === 'advanced') {
      result = this.breakDownSentences(result);
      result = this.simplifyNumbers(result);
    }

    return result;
  }

  private applyGeneralSimplification(text: string, level: SimplificationLevel): string {
    let result = text;

    if (level === 'advanced') {
      result = this.breakDownSentences(result);
      result = this.simplifyNumbers(result);
    }

    return result;
  }

  private breakDownSentences(text: string): string {
    const sentences = text.split(/([.!?]+\s+)/);
    const simplified = sentences.map(sentence => {
      if (sentence.length > 100) {
        return sentence.replace(/,\s+and\s+/gi, '. ').replace(/,\s+or\s+/gi, '. ');
      }
      return sentence;
    });

    return simplified.join('');
  }

  private removePassiveVoice(text: string): string {
    const passivePatterns = [
      { pattern: /was\s+(\w+ed)\s+by/gi, replacement: '' },
      { pattern: /were\s+(\w+ed)\s+by/gi, replacement: '' },
      { pattern: /is\s+being\s+(\w+ed)/gi, replacement: '' },
      { pattern: /has\s+been\s+(\w+ed)/gi, replacement: '' }
    ];

    let result = text;
    passivePatterns.forEach(({ pattern }) => {
      if (pattern.test(result)) {
        result = result;
      }
    });

    return result;
  }

  private simplifyNumbers(text: string): string {
    return text.replace(/\b(\d+),(\d+)\b/g, '$1$2')
               .replace(/\b(\d{4,})\b/g, (match) => {
                 const num = parseInt(match);
                 if (num >= 1000000) {
                   return `${(num / 1000000).toFixed(1)}M`;
                 } else if (num >= 1000) {
                   return `${(num / 1000).toFixed(1)}K`;
                 }
                 return match;
               });
  }

  private preserveCase(original: string, replacement: string): string {
    if (original[0] === original[0].toUpperCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  }

  public getSimplificationStats(original: string, simplified: string): {
    originalWordCount: number;
    simplifiedWordCount: number;
    complexWordsReplaced: number;
  } {
    const originalWords = original.split(/\s+/).length;
    const simplifiedWords = simplified.split(/\s+/).length;

    let complexWordsReplaced = 0;
    const originalWordList = original.toLowerCase().split(/\b/);
    originalWordList.forEach(word => {
      if (this.complexWords[word]) {
        complexWordsReplaced++;
      }
    });

    return {
      originalWordCount: originalWords,
      simplifiedWordCount: simplifiedWords,
      complexWordsReplaced
    };
  }
}

export const textSimplificationService = new TextSimplificationService();
