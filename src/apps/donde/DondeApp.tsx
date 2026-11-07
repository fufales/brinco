import { Redirect, Route, Switch } from 'wouter';
import { EarIcon, MapIcon, PlayIcon } from '../../shared/ui/icons';
import '../../shared/lesson/lesson.css';
import { HomeScreen, type HomeOption } from '../escuela/screens/HomeScreen';
import '../escuela/escuela.css';
import { MoveGame } from './MoveGame';
import { GAME_KEY, LESSON_KEY } from './positions';
import { DiscoverScreen, LessonScreen } from './screens';
import { DondeIcon } from './summary';
import './donde.css';

const OPTIONS: HomeOption[] = [
  { path: '/descubrir', title: 'Descubre', hint: 'Mira a dónde brinca la rana', Icon: EarIcon, color: '#22b8f0', edge: '#0f8fc4' },
  { path: '/leccion', title: 'Lección', hint: 'Escucha, lee y une', Icon: PlayIcon, color: '#6fd64b', edge: '#47a82a', starsKey: LESSON_KEY },
  { path: '/mover', title: '¡Mueve a la rana!', hint: 'Arrástrala a su lugar', Icon: MapIcon, color: '#ffb627', edge: '#df8f00', starsKey: GAME_KEY },
];

export default function DondeApp() {
  return (
    <Switch>
      <Route path="/">
        <HomeScreen title="Brincadónde" Hero={DondeIcon} options={OPTIONS} className="school--donde" />
      </Route>
      <Route path="/descubrir" component={DiscoverScreen} />
      <Route path="/leccion" component={LessonScreen} />
      <Route path="/mover" component={MoveGame} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
