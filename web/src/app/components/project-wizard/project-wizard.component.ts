import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as he from 'he';

import { AccountService } from '../../services/account/account.service';
import { LoggerService } from '../../services/logger/logger.service';
import { NavService } from '../../services/nav/nav.service';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';
import { StoreProps as Props } from '../../services/store/store.props';
import { WordIconService } from '../../services/word-icon/word-icon.service';

@Component({
  selector: 'app-project-wizard',
  templateUrl: './project-wizard.component.html',
  styleUrls: ['./project-wizard.component.scss']
})
export class ProjectWizardComponent implements OnInit, OnDestroy {

  project: any;
  step: number;
  palette: any;
  saving: boolean;

  profile: any;
  profile$: Subscription;

  newProjectTemplate = [
    {
      name: 'Title',
      complete: null,
      title: null,
    },
    {
      name: 'Multipart',
      complete: null,
      multipart: null,
      part_name: null
    },
    {
      name: 'Text',
      complete: null,
      text: null,
      word_count: null
    },
    {
      name: 'Context',
      complete: true,
      context: null
    },
    {
      name: 'Categories',
      complete: null,
      main_category: null,
      adult_category: null,
      categories: []
    },
    {
      name: 'Questions',
      complete: null,
      questions: []
    },
    {
      name: 'Private',
      complete: true,
      private: false,
    },
    {
      name: 'Review',
      complete: null,
      last_saved: null
    }
  ];

  categories = {
    'fiction': [
      { name: 'Abuse', value: 'abuse' },
      { name: 'Addiction', value: 'addiction' },
      { name: 'Admiration', value: 'admiration' },
      { name: 'Adventure', value: 'adventure' },
      { name: 'African', value: 'african' },
      { name: 'Airplane', value: 'airplane' },
      { name: 'Alcohol', value: 'alcohol' },
      { name: 'Allegory', value: 'allegory' },
      { name: 'Alternate History', value: 'alternate-history' },
      { name: 'American', value: 'american' },
      { name: 'Anarchy', value: 'anarchy' },
      { name: 'Anger', value: 'anger' },
      { name: 'Animals', value: 'animals' },
      { name: 'Antarctica', value: 'antarctica' },
      { name: 'Antihero', value: 'antihero' },
      { name: 'Antisocial', value: 'antisocial' },
      { name: 'Apathy', value: 'apathy' },
      { name: 'Artificial Intelligence', value: 'ai' },
      { name: 'Artist', value: 'artist' },
      { name: 'Asian', value: 'asian' },
      { name: 'Assasination', value: 'assasination' },
      { name: 'Australian', value: 'australian' },
      { name: 'Autumn', value: 'autumn' },
      { name: 'Avant Garde', value: 'avant-garde' },
      { name: 'Back to Nature', value: 'back-to-nature' },
      { name: 'Beach', value: 'beach' },
      { name: 'Bildungsroman', value: 'bildungsroman' },
      { name: 'Black', value: 'black' },
      { name: 'Boat', value: 'boat' },
      { name: 'Bus', value: 'bus' },
      { name: 'Calm', value: 'calm' },
      { name: 'Camaraderie', value: 'camaraderie' },
      { name: 'Car', value: 'car' },
      { name: 'Cave', value: 'cave' },
      { name: 'Celebration', value: 'celebration' },
      { name: 'Chamber Drama', value: 'chamber-drama' },
      { name: 'Change', value: 'change' },
      { name: 'Charity', value: 'charity' },
      { name: 'Chase', value: 'chase' },
      { name: 'Chastity', value: 'chastity' },
      { name: 'Childhood', value: 'childhood' },
      { name: 'Children', value: 'children' },
      { name: 'College', value: 'college' },
      { name: 'Comedy', value: 'comedy' },
      { name: 'Community', value: 'community' },
      { name: 'Corporate', value: 'corporate' },
      { name: 'Conspiracy', value: 'conspiracy' },
      { name: 'Consumerism', value: 'consumerism' },
      { name: 'Control', value: 'control' },
      { name: 'Corruption', value: 'corruption' },
      { name: 'Courtroom', value: 'courtroom' },
      { name: 'Cosmic', value: 'cosmic' },
      { name: 'Cozy', value: 'cozy' },
      { name: 'Crime', value: 'crime' },
      { name: 'Crisis', value: 'crisis' },
      { name: 'Cult', value: 'cult' },
      { name: 'Dance', value: 'dance' },
      { name: 'Dark', value: 'dark' },
      { name: 'Death', value: 'death' },
      { name: 'Depression', value: 'depression' },
      { name: 'Desert', value: 'desert' },
      { name: 'Desperation', value: 'desperation' },
      { name: 'Detective', value: 'detective' },
      { name: 'Disability', value: 'disability' },
      { name: 'Disease', value: 'disease' },
      { name: 'Disobedience', value: 'disobedience' },
      { name: 'Disruption', value: 'disruption' },
      { name: 'Disturbing', value: 'disturbing' },
      { name: 'Divorce', value: 'divorce' },
      { name: 'Do the Right Thing', value: 'do-the-right-thing' },
      { name: 'Doubt', value: 'doubt' },
      { name: 'Drama', value: 'drama' },
      { name: 'Drugs', value: 'drugs' },
      { name: 'Dystopia', value: 'dystopia' },
      { name: 'Eastern', value: 'eastern' },
      { name: 'Education', value: 'education' },
      { name: 'Elderly', value: 'elderly' },
      { name: 'Entertainment', value: 'entertainment' },
      { name: 'Entreprenuer', value: 'entreprenuer' },
      { name: 'Envy', value: 'envy' },
      { name: 'Epiphany', value: 'epiphany' },
      { name: 'Epistolary', value: 'epistolary' },
      { name: 'Erotica', value: 'erotica' },
      { name: 'Espionage', value: 'espionage' },
      { name: 'Ethics', value: 'ethics' },
      { name: 'European', value: 'european' },
      { name: 'Existential', value: 'existential' },
      { name: 'Exploitation', value: 'exploitation' },
      { name: 'Exploration', value: 'exploration' },
      { name: 'Explosion', value: 'explosion' },
      { name: 'Evil', value: 'evil' },
      { name: 'Faith', value: 'faith' },
      { name: 'Falsehood', value: 'falsehood' },
      { name: 'Family', value: 'family' },
      { name: 'Fan Fiction', value: 'fan-fiction' },
      { name: 'Father', value: 'father' },
      { name: 'Fatherhood', value: 'fatherhood' },
      { name: 'Fear', value: 'fear' },
      { name: 'Feel-good', value: 'feel-good' },
      { name: 'Food', value: 'food' },
      { name: 'Forget', value: 'forget' },
      { name: 'Fun', value: 'fun' },
      { name: 'Funny', value: 'funny' },
      { name: 'Fantasy', value: 'fantasy' },
      { name: 'Feminist', value: 'feminist' },
      { name: 'Feud', value: 'feud' },
      { name: 'Fish out of Water', value: 'fish-out-of-water' },
      { name: 'Flash Fiction', value: 'flash-fiction' },
      { name: 'Forbidden Love', value: 'forbidden-love' },
      { name: 'Forest', value: 'forest' },
      { name: 'Forgetfulness', value: 'forgetfulness' },
      { name: 'Freedom', value: 'freedom' },
      { name: 'Friendship', value: 'friendship' },
      { name: 'Gambling', value: 'gambling' },
      { name: 'Gang', value: 'gang' },
      { name: 'Genocide', value: 'genocide' },
      { name: 'Ghost', value: 'ghost' },
      { name: 'Gluttony', value: 'gluttony' },
      { name: 'God', value: 'god' },
      { name: 'Goddess', value: 'goddess' },
      { name: 'Goodness', value: 'goodness' },
      { name: 'Government', value: 'government' },
      { name: 'Greed', value: 'greed' },
      { name: 'Growth', value: 'growth' },
      { name: 'Guns', value: 'guns' },
      { name: 'Heist', value: 'heist' },
      { name: 'Heroic', value: 'heroic' },
      { name: 'Hero\'s Journey', value: 'heros-journey' },
      { name: 'High School', value: 'high-school' },
      { name: 'History', value: 'history' },
      { name: 'Holocaust', value: 'holocaust' },
      { name: 'Home', value: 'home' },
      { name: 'Homelessness', value: 'homelessness' },
      { name: 'Homosexuality', value: 'homosexuality' },
      { name: 'Hope', value: 'hope' },
      { name: 'Hopeless', value: 'hopeless' },
      { name: 'Horror', value: 'horror' },
      { name: 'Humiliation', value: 'humiliation'},
      { name: 'Humility', value: 'humility' },
      { name: 'Humor', value: 'humor' },
      { name: 'Hunt', value: 'hunt' },
      { name: 'Industry', value: 'industry' },
      { name: 'Inequality', value: 'inequality' },
      { name: 'Infidelity', value: 'infedelity' },
      { name: 'Injury', value: 'injury' },
      { name: 'Injustice', value: 'injustice' },
      { name: 'Insanity', value: 'insanity' },
      { name: 'Intelligence', value: 'intelligence' },
      { name: 'Internet', value: 'internet' },
      { name: 'Intolerance', value: 'intolerance' },
      { name: 'Intrigue', value: 'intrigue' },
      { name: 'Invention', value: 'invention' },
      { name: 'Island', value: 'island' },
      { name: 'Isolation', value: 'isolation' },
      { name: 'Job', value: 'job' },
      { name: 'Joke', value: 'joke' },
      { name: 'Justice', value: 'justice' },
      { name: 'Kindness', value: 'kindness' },
      { name: 'Lake', value: 'lake' },
      { name: 'Latino', value: 'latino' },
      { name: 'Lazy', value: 'lazy' },
      { name: 'Legal', value: 'legal' },
      { name: 'LGBTQ', value: 'lgbtq' },
      { name: 'Light-hearted', value: 'light-hearted' },
      { name: 'Literary', value: 'literary' },
      { name: 'Loneliness', value: 'loneliness' },
      { name: 'Love', value: 'love' },
      { name: 'Love Triangle', value: 'love-triangle' },
      { name: 'Lost', value: 'lost' },
      { name: 'Lust', value: 'lust' },
      { name: 'Madness', value: 'madness' },
      { name: 'Mafia', value: 'mafia' },
      { name: 'Magic', value: 'magic' },
      { name: 'Magical Realism', value: 'magical-realism' },
      { name: 'Man behind the Curtain', value: 'man-behind-the-curtain' },
      { name: 'Man and Machine', value: 'man-and-machine' },
      { name: 'Man and Nature', value: 'man-and-nature' },
      { name: 'Medical', value: 'medical' },
      { name: 'Meditative', value: 'meditative' },
      { name: 'Melancholy', value: 'melancholy' },
      { name: 'Memory', value: 'memory' },
      { name: 'Midlife Crisis', value: 'midlife-crisis' },
      { name: 'Minority', value: 'minority' },
      { name: 'Mob Mentality', value: 'mob-mentality' },
      { name: 'Mother', value: 'mother' },
      { name: 'Motherhood', value: 'motherhood' },
      { name: 'Money', value: 'money' },
      { name: 'Mono No Aware', value: 'mono-no-aware' },
      { name: 'Monster', value: 'monster' },
      { name: 'Morality', value: 'morality' },
      { name: 'Mountains', value: 'mountains' },
      { name: 'Movies', value: 'movies' },
      { name: 'Murder', value: 'murder' },
      { name: 'Mystery', value: 'mystery' },
      { name: 'Myth and Folklore', value: 'myth-and-folklore' },
      { name: 'Music', value: 'music' },
      { name: 'Mythopoeia', value: 'mythopoeia' },
      { name: 'Nature', value: 'nature' },
      { name: 'Noir', value: 'noir' },
      { name: 'Noise', value: 'noise' },
      { name: 'North American', value: 'north-american' },
      { name: 'Northern', value: 'northern' },
      { name: 'Nostalgic', value: 'nostalgic' },
      { name: 'Obedience', value: 'obedience' },
      { name: 'Ocean', value: 'ocean' },
      { name: 'Oppression', value: 'oppression' },
      { name: 'Overcoming the Monster', value: 'overcoming-the-monster' },
      { name: 'Paradox', value: 'paradox' },
      { name: 'Parenthood', value: 'parenthood' },
      { name: 'Party', value: 'party' },
      { name: 'Pastoral', value: 'pastoral' },
      { name: 'Passion', value: 'passion' },
      { name: 'Patience', value: 'patience' },
      { name: 'Philosophy', value: 'philosphy' },
      { name: 'Pioneer', value: 'pioneer' },
      { name: 'Plain', value: 'plain' },
      { name: 'Play', value: 'play' },
      { name: 'Poison', value: 'poison' },
      { name: 'Police', value: 'police' },
      { name: 'Political', value: 'political' },
      { name: 'Pornography', value: 'pornography' },
      { name: 'Power', value: 'power' },
      { name: 'Poverty', value: 'poverty' },
      { name: 'Prejudice', value: 'prejudice' },
      { name: 'Prudence', value: 'prudence' },
      { name: 'Pride', value: 'pride' },
      { name: 'Prison', value: 'prison' },
      { name: 'Prostitution', value: 'prostitution' },
      { name: 'Psychedelic', value: 'psychedelic' },
      { name: 'Quest', value: 'quest' },
      { name: 'Race', value: 'race' },
      { name: 'Racism', value: 'racism' },
      { name: 'Rage against the Machine', value: 'rage-against-the-machine' },
      { name: 'Rags to Riches', value: 'rags-to-riches' },
      { name: 'Rape', value: 'rape' },
      { name: 'Realistic', value: 'realistic' },
      { name: 'Rebirth', value: 'rebirth' },
      { name: 'Regret', value: 'regret' },
      { name: 'Religious', value: 'religious' },
      { name: 'Revenge', value: 'revenge' },
      { name: 'Riches to Rags', value: 'riches-to-rags' },
      { name: 'River', value: 'river' },
      { name: 'Road Trip', value: 'road-trip' },
      { name: 'Romance', value: 'romance' },
      { name: 'Rural', value: 'rural' },
      { name: 'Sacrifice', value: 'sacrifice' },
      { name: 'Sad', value: 'sad' },
      { name: 'Sad Clown', value: 'sad-clown' },
      { name: 'Sadness', value: 'sadness' },
      { name: 'Satire', value: 'satire' },
      { name: 'Save the Cat', value: 'save-the-cat' },
      { name: 'Scary', value: 'scary' },
      { name: 'School', value: 'school' },
      { name: 'Science', value: 'science' },
      { name: 'Science Fiction', value: 'science-fiction' },
      { name: 'Seduction', value: 'seduction' },
      { name: 'Sexuality', value: 'sexuality' },
      { name: 'Shame', value: 'shame' },
      { name: 'Ship', value: 'ship' },
      { name: 'Sickness', value: 'sickness' },
      { name: 'Silence', value: 'silence' },
      { name: 'Silly', value: 'silly' },
      { name: 'Slavery', value: 'slavery' },
      { name: 'Sleuth', value: 'sleuth' },
      { name: 'Sloth', value: 'sloth' },
      { name: 'Small Town', value: 'small-town' },
      { name: 'Spiritual', value: 'spiritual' },
      { name: 'Sports', value: 'sports' },
      { name: 'Spring', value: 'spring' },
      { name: 'South American', value: 'south-american' },
      { name: 'Southern', value: 'southern' },
      { name: 'Steampunk', value: 'steampunk' },
      { name: 'Stoic', value: 'stoic' },
      { name: 'Storm', value: 'storm' },
      { name: 'Stranger', value: 'stranger' },
      { name: 'Strength', value: 'strength' },
      { name: 'Stupidity', value: 'stupidity' },
      { name: 'Sublime', value: 'sublime' },
      { name: 'Suburban', value: 'suburban' },
      { name: 'Subtle', value: 'subtle' },
      { name: 'Subway', value: 'subway' },
      { name: 'Suicide', value: 'suicide' },
      { name: 'Summer', value: 'summer' },
      { name: 'Surreal', value: 'surreal' },
      { name: 'Survival', value: 'survival' },
      { name: 'Tall Tale', value: 'tall-tale' },
      { name: 'Tearjerker', value: 'tearjerker' },
      { name: 'Teen', value: 'teen' },
      { name: 'Technology', value: 'technology' },
      { name: 'Temperance', value: 'temperance' },
      { name: 'Terror', value: 'terror' },
      { name: 'Thieves', value: 'thieves' },
      { name: 'Thrill-seeking', value: 'thrill-seeking' },
      { name: 'Thriller', value: 'thriller' },
      { name: 'Tradition', value: 'tradition' },
      { name: 'Tragedy', value: 'tragedy' },
      { name: 'Train', value: 'train' },
      { name: 'Transgression', value: 'transgression' },
      { name: 'Treachery', value: 'treachery' },
      { name: 'Truth', value: 'truth' },
      { name: 'Twist', value: 'twist' },
      { name: 'Underdog', value: 'underdog' },
      { name: 'Underground', value: 'underground' },
      { name: 'Urban', value: 'urban' },
      { name: 'Usury', value: 'usury' },
      { name: 'Utopia', value: 'utopia' },
      { name: 'Vacation', value: 'vacation' },
      { name: 'Violence', value: 'violence' },
      { name: 'Volcano', value: 'volcano' },
      { name: 'Voyage', value: 'voyage' },
      { name: 'Voyage and Return', value: 'voyage-and-return' },
      { name: 'Wabi-Sabi', value: 'wabi-sabi' },
      { name: 'War', value: 'war' },
      { name: 'Wealth', value: 'wealth' },
      { name: 'Weakness', value: 'weakness' },
      { name: 'Web', value: 'web' },
      { name: 'Wedding', value: 'wedding' },
      { name: 'Weird', value: 'weird' },
      { name: 'Western', value: 'western' },
      { name: 'Whimsical', value: 'whimsical' },
      { name: 'Whodunit', value: 'whodunit' },
      { name: 'Winter', value: 'winter' },
      { name: 'Wisdom', value: 'wisdom' },
      { name: 'Witty', value: 'witty' },
      { name: 'Work', value: 'work' },
      { name: 'Workplace', value: 'workplace' },
      { name: 'Wrath', value: 'wrath' },
      { name: 'Writing', value: 'writing' },
      { name: 'Zen', value: 'zen' },
    ],
    'non-fiction': [
      { name: 'Analysis', value: 'analysis' },
      { name: 'Art', value: 'art' },
      { name: 'Biography', value: 'biography' },
      { name: 'Blog', value: 'blog' },
      { name: 'Conservative', value: 'conservative' },
      { name: 'Critique', value: 'critique' },
      { name: 'Earth', value: 'earth' },
      { name: 'Education', value: 'education' },
      { name: 'Essay', value: 'essay' },
      { name: 'Feminist', value: 'feminist' },
      { name: 'Gaming', value: 'gaming' },
      { name: 'Guide', value: 'guide' },
      { name: 'History', value: 'history' },
      { name: 'Humor', value: 'humor' },
      { name: 'Journal', value: 'journal' },
      { name: 'LGBTQ', value: 'lgbtq' },
      { name: 'Liberal', value: 'liberal' },
      { name: 'Media', value: 'media' },
      { name: 'Memoir', value: 'memoir' },
      { name: 'Minority', value: 'minority' },
      { name: 'Music', value: 'music' },
      { name: 'Parenting', value: 'parenting' },
      { name: 'Philosophy', value: 'philosophy' },
      { name: 'Political', value: 'political' },
      { name: 'Recipe', value: 'recipe' },
      { name: 'Religious', value: 'religious' },
      { name: 'Review', value: 'review' },
      { name: 'Science', value: 'science' },
      { name: 'Space', value: 'space' },
      { name: 'Spiritual', value: 'spiritual' },
      { name: 'Technology', value: 'technology' }
    ],
    'poetry': [
      { name: 'Epic', value: 'epic' },
      { name: 'Free Verse', value: 'free-verse' },
      { name: 'Haiku', value: 'haiku' },
      { name: 'Narrative', value: 'narrative' },
      { name: 'Nonsense', value: 'nonsense' },
      { name: 'Rhyming', value: 'rhyming' },
      { name: 'Song', value: 'song' },
      { name: 'Spoken Word', value: 'spoken-word' }
    ]
  };


  questions = {
    'fiction': [
      { name: 'At what point did you start to skim? Why did you?', value: 'At what point did you start to skim? Why did you?' },
      { name: 'Could you relate to the main character?', value: 'Could you relate to the main character?' },
      { name: 'Did the dialogue keep your interest and sound natural to you? If not, whose dialogue did you think sounded artificial or not like that person would speak?', value: 'Did the dialogue keep your interest and sound natural to you? If not, whose dialogue did you think sounded artificial or not like that person would speak?' },
      { name: 'Did the setting interest you and did the descriptions seem vivid and real to you?', value: 'Did the setting interest you and did the descriptions seem vivid and real to you?' },
      { name: 'Did the story hold your interest from the very beginning? If not, why not?', value: 'Did the story hold your interest from the very beginning? If not, why not?' },
      { name: 'Did you feel there was too much description or exposition? Not enough? Maybe too much dialogue in parts?', value: 'Did you feel there was too much description or exposition? Not enough? Maybe too much dialogue in parts?' },
      { name: 'Did you get confused about who\'s who in the characters? Were there too many characters to keep track of? Too few? Are any of the names of characters too similar?', value: 'Did you get confused about who\'s who in the characters? Were there too many characters to keep track of? Too few? Are any of the names of characters too similar?' },
      { name: 'Did you get oriented fairly quickly at the beginning as to whose story it is, and where and when it\'s taking place? If not, why not?', value: 'Did you get oriented fairly quickly at the beginning as to whose story it is, and where and when it\'s taking place? If not, why not?' },
      { name: 'Did you notice any discrepancies or inconsistencies in time sequences, places, character details, or other details?', value: 'Did you notice any discrepancies or inconsistencies in time sequences, places, character details, or other details?' },
      { name: 'Did you notice any obvious, repeating grammatical, spelling, punctuation or capitalization errors? Examples?', value: 'Did you notice any obvious, repeating grammatical, spelling, punctuation or capitalization errors? Examples?' },
      { name: 'Do you think the writing style suits the genre? If not, why not?', value: 'Do you think the writing style suits the genre? If not, why not?' },
      { name: 'Was there a point at which you felt the story lagged or you became less than excited about finding out what was going to happen next? Where exactly?', value: 'Was there a point at which you felt the story lagged or you became less than excited about finding out what was going to happen next? Where exactly?' },
      { name: 'Was there enough conflict, tension, and intrigue to keep your interest?', value: 'Was there enough conflict, tension, and intrigue to keep your interest?' },
      { name: 'Were the characters believable? Are there any characters you think could be made more interesting or more likable?', value: 'Were the characters believable? Are there any characters you think could be made more interesting or more likable?' },
      { name: 'Was the ending satisfying? Believable?', value: 'Was the ending satisfying? Believable?' },
      { name: 'Were there any parts that confused you? Or even frustrated or annoyed you? Which parts, and why?', value: 'Were there any parts that confused you? Or even frustrated or annoyed you? Which parts, and why?' }
    ],
    'non-fiction': [
      { name: 'At what point did you start to skim? Why did you?', value: 'At what point did you start to skim? Why did you?' },
      { name: 'Could some of the stories or ideas be more punchy? If so, how so?', value: 'Could some of the stories or ideas be more punchy? If so, how so?' },
      { name: 'Did any of the research or examples seem far-fetched?', value: 'Did any of the research or examples seem far-fetched?' },
      { name: 'Did it provide helpful next steps?', value: 'Did it provide helpful next steps?' },
      { name: 'Did the topic seem exciting if you had no prior knowledge of it?', value: 'Did the topic seem exciting if you had no prior knowledge of it?' },
      { name: 'Did you understand the author\'s reason for writing the work? Did you feel their pain or excitement?', value: 'Did you understand the author\'s reason for writing the work? Did you feel their pain or excitement?' },
      { name: 'Did you notice any obvious, repeating grammatical, spelling, punctuation or capitalization errors? Examples?', value: 'Did you notice any obvious, repeating grammatical, spelling, punctuation or capitalization errors? Examples?' },
      { name: 'Was the narrative interesting and did it move along? Why or why not?', value: 'Was the narrative interesting and did it move along? Why or why not?' },
      { name: 'Was there too much information, research, or not enough? Was the information helpful or did it drag?', value: 'Was there too much information, research, or not enough? Was the information helpful or did it drag?' },
      { name: 'Were any details repeated or redundant?', value: 'Were any details repeated or redundant?' },
      { name: 'Where did it get boring? What parts could be cut out?', value: 'Where did it get boring? What parts could be cut out?' },
      
    ],
    'poetry': [
      { name: 'At what point did you start to skim? Why did you?', value: 'At what point did you start to skim? Why did you?' },
      { name: 'Did you notice any obvious, repeating grammatical, spelling, punctuation or capitalization errors? Examples?', value: 'Did you notice any obvious, repeating grammatical, spelling, punctuation or capitalization errors? Examples?' },
      { name: 'Does the writing seem vivid and real to you?', value: 'Does the writing seem vivid and real to you?' },
      { name: 'How did it make you feel?', value: 'How did it make you feel?' },
      { name: 'Were there any parts that confused you? Or even frustrated or annoyed you? Which parts, and why?', value: 'Were there any parts that confused you? Or even frustrated or annoyed you? Which parts, and why?' }
    ]
  };

  constructor (
    private accountService: AccountService,
    private loggerService: LoggerService,
    private navService: NavService,
    private storeService: StoreService,
    private wordIconService: WordIconService
  ) { }

  ngOnInit () {
    this.updateProjectPalette(null);
    this.setupSubscriptions();
  }

  ngOnDestroy () {
    this.teardownSubscriptions();
  }

  private stripHtml (html) {
    return he.decode(html.replace(/<[^>]+>/g, ''));
  }

  private projectTitle () {
    return this.project[0].title;
  }

  private setupProject () {
    this.project = this.profile.project_in_progress || this.newProjectTemplate;
    if (this.profile.project_in_progress) {
      this.setCurrStep(-1, true);
      this.updateProjectPalette(this.projectTitle());
    } else {
      this.setCurrStep(this.getCurrStep(this.project));
    }
  }

  private newProject () {
    this.project = this.newProjectTemplate;
    this.updateProjectPalette(null);
    this.setCurrStep(this.getCurrStep(this.project));
  }

  private getCurrStep (project): number {
    let step = -1;
    for (let p = 0; p < project.length; p += 1) {
      if (!project[p].complete) {
        step = p;
        break;
      }
    }
    return step;
  }

  private setCurrStep (step, skipSave = null) {
    if (step !== null) {
      this.step = step;
      window.scroll(0, 0);
      if (!skipSave) this.saveProjectInProgress();
    }
  }

  private createProject () {
    this.navService.gotoRoot();
  }

  private setupSubscriptions () {
    this.profile$ = this.storeService.subscribe(Props.App.Profile, p => {
      this.profile = p && p.toJS();
      if (!this.project) this.setupProject();
    });
  }

  private teardownSubscriptions () {
    this.profile$.unsubscribe();
  }

  private updateProjectPalette (hash) {
    this.palette = this.wordIconService.getPalette(hash);
  }

  private stepOne_titleChanged (title) {
    this.project[this.step].title = title;
    this.project[this.step].complete = (title && title.length > 0) ? true : false;
    this.updateProjectPalette(title);
  }

  private stepTwo_multipartChanged (isMultipart) {
    this.project[this.step].multipart = (isMultipart === 'true') ? true : false;
    if (!this.project[this.step].multipart) this.stepTwo_partNameChanged(null);
    this.project[this.step].complete = true;
  }

  private stepTwo_partNameChanged (name) {
    this.project[this.step].part_name = name;
  }

  private stepThree_textChanged (res) {
    this.project[this.step].text = res.text;
    this.project[this.step].word_count = res.word_count;
    this.project[this.step].complete = 
      (res.word_count > 0 && res.word_count <= 5000) 
      ? true 
      : false;
  }

  private stepFour_contextChanged (res) {
    this.project[this.step].context = res.text;
    this.project[this.step].complete = 
      (res.word_count > 0 && res.word_count <= 300) 
      ? true 
      : false;
  }

  private removeItem (arr, item) {
    let index = arr.indexOf(item);
    if (index !== -1) arr.splice(index, 1);
  }

  private stepFive_mainCategoryChanged (category) {
    this.project[this.step].main_category = category;
    this.stepFive_checkComplete();
  }

  private stepFive_adultCategoryChanged (category) {
    this.project[this.step].adult_category = category;
    this.stepFive_checkComplete();
  }

  private stepFive_categoryListChanged (list) {
    this.project[this.step].categories = list.map(i => i.value);
  }

  private stepFive_checkComplete () {
    let mainComplete = this.project[this.step].main_category ? true : false;
    let adultComplete = this.project[this.step].adult_category ? true : false;
    this.project[this.step].complete = (mainComplete && adultComplete);
  }

  private stepSix_questionListChanged (list) {
    this.project[this.step].questions = list.map(i => i.value);
    this.project[this.step].complete = (this.project[this.step].questions.length > 0);
  }

  private stepSeven_privateChanged (isPrivate: boolean) {
    this.project[this.step].private = isPrivate;
  }

  private saveProjectInProgress () {
    let title = this.project[0].title;
    if (title) {
      this.saving = true;
      this.project[this.project.length - 1].last_saved = (new Date()).valueOf();
      this.accountService.updateProfile({ project_in_progress: this.project })
      .then(updated => {
        this.saving = false;
        this.storeService.dispatch(Actions.Init.Profile, updated);
      }).catch(err => {
        this.saving = false;
        this.loggerService.error(err);
      });
    }
  }

}
