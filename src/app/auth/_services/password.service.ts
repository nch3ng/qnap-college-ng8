import { Injectable } from '@angular/core';

@Injectable()
export class PasswordService {
  scorePassword = (pass): number => {
    let score = 0;
    if (!pass) {
      return score;
    }
    // award every unique letter until 5 repetitions
    let letters = new Object();
    for (let i=0; i<pass.length; i++) {
      letters[pass[i]] = (letters[pass[i]] || 0) + 1;
      score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    let variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /\W/.test(pass),
    }

  let variationCount = 0;
  for (let check in variations) {
      variationCount += (variations[check] == true) ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  return score;
  }

  checkPassStrength = (pass): string => {
    let score = this.scorePassword(pass);
    // console.log(score);
    if (score > 75)
        return "strong";
    if (score > 60)
        return "good";
    if (score >= 30)
        return "weak";

    return "";
  }
}