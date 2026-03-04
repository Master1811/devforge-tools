const WORDLIST = [
  "abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse",
  "access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act",
  "action","actor","actress","actual","adapt","add","addict","address","adjust","admit",
  "adult","advance","advice","afford","afraid","again","agent","agree","ahead","aim",
  "air","airport","aisle","alarm","album","alcohol","alert","alien","allow","almost",
  "alone","alpha","already","also","alter","always","amateur","amazing","among","amount",
  "amused","anchor","ancient","anger","angle","angry","animal","ankle","announce","annual",
  "another","answer","antenna","antique","anxiety","apart","apology","appear","apple","approve",
  "arch","arctic","area","arena","argue","armor","army","arrange","arrest","arrive",
  "arrow","artist","artwork","aspect","assault","asset","assist","assume","attack","attend",
  "attract","auction","audit","august","aunt","author","autumn","average","avocado","avoid",
  "awake","aware","awesome","awful","axis","baby","bachelor","bacon","badge","bag",
  "balance","balcony","ball","bamboo","banana","banner","barely","bargain","barrel","basket",
  "battle","beach","bean","beauty","become","before","begin","behind","believe","below",
  "bench","benefit","best","betray","better","between","beyond","bicycle","bird","birth",
  "bitter","black","blade","blame","blanket","blast","bleak","bless","blind","blood",
  "blossom","blow","blue","blur","blush","board","boat","body","boil","bomb",
  "bone","bonus","book","boost","border","boring","borrow","boss","bottom","bounce",
  "brain","brand","brave","bread","breeze","brick","bridge","brief","bright","bring",
  "broad","broken","brother","brown","brush","bubble","buddy","budget","buffalo","build",
  "bulb","bullet","bundle","burden","burger","burst","bus","business","busy","butter",
  "buyer","cabin","cable","cactus","cage","cake","call","calm","camera","camp",
  "canal","cancel","candy","cannon","canoe","canvas","canyon","capable","capital","captain",
  "carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle",
  "casual","catalog","catch","category","cattle","caught","cause","caution","cave","ceiling",
  "celery","cement","census","century","cereal","certain","chair","chalk","champion","change",
  "chaos","chapter","charge","chase","cheap","check","cheese","cherry","chest","chicken",
  "chief","child","chimney","choice","choose","chunk","churn","circle","citizen","city",
  "civil","claim","clap","clarify","claw","clay","clean","clerk","clever","click",
  "client","cliff","climb","clinic","clip","clock","close","cloth","cloud","clown",
  "club","clump","cluster","clutch","coach","coast","coconut","code","coffee","coil",
  "coin","collect","color","column","combine","come","comfort","comic","common","company",
  "concert","conduct","confirm","congress","connect","consider","control","convince","cook","cool",
  "copper","copy","coral","core","corn","correct","cost","cotton","couch","country",
  "couple","course","cousin","cover","craft","crane","crash","crater","crawl","crazy",
  "cream","credit","creek","crew","cricket","crime","crisp","critic","crop","cross",
  "crouch","crowd","crucial","cruel","cruise","crumble","crush","cry","crystal","cube",
  "culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cycle",
  "damage","dance","danger","daring","dash","daughter","dawn","debate","debris","decade",
  "december","decide","decline","decorate","decrease","deer","defense","define","defy","degree",
  "delay","deliver","demand","demise","denial","dentist","deny","depart","depend","deposit",
  "depth","deputy","derive","describe","desert","design","desk","despair","destroy","detail",
  "detect","develop","device","devote","diagram","dial","diamond","diary","diesel","diet",
  "differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover",
  "disease","dish","dismiss","disorder","display","distance","divert","divide","divorce","dizzy",
  "doctor","document","dog","doll","dolphin","domain","donate","donkey","door","dose",
  "double","dove","draft","dragon","drama","drastic","draw","dream","dress","drift",
  "drill","drink","drip","drive","drop","drum","dry","duck","dumb","dune",
  "during","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn",
  "earth","easily","east","easy","echo","ecology","economy","edge","edit","educate",
  "effort","eight","either","elbow","elder","electric","elegant","element","elephant","elevator",
  "elite","else","embrace","emerge","emotion","employ","empower","empty","enable","endorse",
  "enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich",
  "enroll","ensure","enter","entire","entry","envelope","episode","equal","equip","erode",
  "erosion","error","erupt","escape","essay","essence","estate","eternal","ethics","evidence",
  "evil","evolve","exact","example","excess","exchange","excite","exclude","excuse","execute",
  "exercise","exhaust","exhibit","exile","exist","exit","exotic","expand","expect","expire",
  "explain","expose","express","extend","extra","fabric","face","faculty","fade","faint",
  "faith","fall","false","fame","family","famous","fan","fancy","fantasy","farm",
  "fashion","fatal","father","fatigue","fault","favorite","feature","february","federal","fee",
  "feed","feel","female","fence","festival","fetch","fever","field","figure","file",
  "film","filter","final","find","fine","finger","finish","fire","firm","fiscal",
  "fish","fitness","flag","flame","flash","flat","flavor","flee","flight","flip",
  "float","flock","floor","flower","fluid","flush","fly","foam","focus","fog",
  "foil","fold","follow","food","foot","force","forest","forget","fork","fortune",
  "forum","forward","fossil","foster","found","fox","fragile","frame","frequent","fresh",
  "friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun",
  "funny","furnace","fury","future","gadget","gain","galaxy","gallery","game","gap",
  "garage","garbage","garden","garlic","garment","gas","gasp","gate","gather","gauge",
  "gaze","general","genius","genre","gentle","genuine","gesture","ghost","giant","gift",
  "giggle","ginger","giraffe","glad","glance","glare","glass","glide","glimpse","globe",
  "gloom","glory","glove","glow","glue","goat","goddess","gold","good","goose",
  "gorilla","gospel","gossip","govern","gown","grab","grace","grain","grant","grape",
  "grass","gravity","great","green","grid","grief","grit","grocery","group","grow",
  "grunt","guard","guess","guide","guilt","guitar","gun","gym","habit","hair",
  "half","hammer","hamster","hand","happy","harbor","hard","harsh","harvest","hat",
  "have","hawk","hazard","head","health","heart","heavy","hedgehog","height","hello",
  "helmet","help","hen","hero","hidden","high","hill","hint","hip","hire",
  "history","hobby","hockey","hold","hole","holiday","hollow","home","honey","hood",
  "hope","horn","horror","horse","hospital","host","hotel","hour","hover","hub",
  "huge","human","humble","humor","hundred","hungry","hunt","hurdle","hurry","hurt",
  "husband","hybrid","ice","icon","idea","identify","idle","ignore","illegal","illness",
  "image","imitate","immense","immune","impact","impose","improve","impulse","inch","include",
  "income","increase","index","indicate","indoor","industry","infant","inflict","inform","initial",
  "inject","inmate","inner","innocent","input","inquiry","insane","insect","inside","inspire",
  "install","intact","interest","into","invest","invite","involve","iron","island","isolate",
  "issue","item","ivory","jacket","jaguar","january","jazz","jealous","jeans","jelly",
  "jewel","job","join","joke","journey","joy","judge","juice","jump","jungle",
  "junior","junk","just","kangaroo","keen","keep","ketchup","key","kick","kid",
  "kidney","kind","kingdom","kiss","kitchen","kite","kitten","kiwi","knee","knife",
  "knock","know","label","labor","ladder","lady","lake","lamp","language","laptop",
];

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  customSymbols?: string;
}

function getCharset(opts: PasswordOptions): string {
  let chars = "";
  const ambiguous = "0O1lI";
  if (opts.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (opts.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.numbers) chars += "0123456789";
  if (opts.symbols) chars += opts.customSymbols || "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (opts.excludeAmbiguous) chars = chars.split("").filter(c => !ambiguous.includes(c)).join("");
  return chars || "abcdefghijklmnopqrstuvwxyz";
}

export function generatePassword(opts: PasswordOptions): string {
  const charset = getCharset(opts);
  const array = new Uint32Array(opts.length);
  crypto.getRandomValues(array);
  return Array.from(array, v => charset[v % charset.length]).join("");
}

export function generatePassphrase(words: number, delimiter: string = "-"): string {
  const array = new Uint32Array(words);
  crypto.getRandomValues(array);
  return Array.from(array, v => WORDLIST[v % WORDLIST.length]).join(delimiter);
}

export function calculateEntropy(opts: PasswordOptions): number {
  const charset = getCharset(opts);
  return Math.floor(opts.length * Math.log2(charset.length));
}

export function crackTimeEstimate(entropy: number): string {
  const guessesPerSec = 10_000_000_000;
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSec;
  if (seconds < 1) return "instant";
  if (seconds < 60) return `${Math.floor(seconds)} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.floor(seconds / 86400)} days`;
  const years = seconds / 31536000;
  if (years > 1e15) return "heat death of the universe";
  if (years > 1e9) return `${(years / 1e9).toFixed(1)} billion years`;
  if (years > 1e6) return `${(years / 1e6).toFixed(1)} million years`;
  return `${Math.floor(years)} years`;
}

export function strengthLabel(entropy: number): { label: string; color: string; percent: number } {
  if (entropy < 28) return { label: "Weak", color: "hsl(0, 84%, 60%)", percent: 20 };
  if (entropy < 50) return { label: "Fair", color: "hsl(30, 84%, 60%)", percent: 40 };
  if (entropy < 80) return { label: "Strong", color: "hsl(160, 84%, 43%)", percent: 70 };
  return { label: "Very Strong", color: "hsl(160, 84%, 43%)", percent: 100 };
}
