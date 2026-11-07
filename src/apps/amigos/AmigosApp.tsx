import { Redirect, Route, Switch } from 'wouter';
import '../../shared/lesson/lesson.css';
import { CampusGame } from '../escuela/CampusGame';
import { DiscoverScreen } from '../escuela/screens/DiscoverScreen';
import { HomeScreen, schoolOptions } from '../escuela/screens/HomeScreen';
import { LessonScreen } from '../escuela/screens/LessonScreen';
import '../escuela/escuela.css';
import { AmigosIcon } from './summary';
import { PEOPLE_TOPIC } from './topic';
import './amigos.css';

const OPTIONS = schoolOptions(PEOPLE_TOPIC, 'Conoce a la gente de la escuela', {
  path: '/quien',
  title: '¿Quién es?',
  hint: 'Encuentra a cada persona',
});

export default function AmigosApp() {
  return (
    <Switch>
      <Route path="/">
        <HomeScreen title="Brincamigos" Hero={AmigosIcon} options={OPTIONS} className="school--people" />
      </Route>
      <Route path="/descubrir">
        <DiscoverScreen topic={PEOPLE_TOPIC} />
      </Route>
      <Route path="/leccion">
        <LessonScreen topic={PEOPLE_TOPIC} />
      </Route>
      <Route path="/quien">
        <CampusGame topic={PEOPLE_TOPIC} />
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
