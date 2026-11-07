import { Redirect, Route, Switch } from 'wouter';
import '../../shared/lesson/lesson.css';
import { CampusGame } from './CampusGame';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { HomeScreen, schoolOptions } from './screens/HomeScreen';
import { LessonScreen } from './screens/LessonScreen';
import { SchoolIcon } from './summary';
import { PLACES_TOPIC } from './topics';
import './escuela.css';

const OPTIONS = schoolOptions(PLACES_TOPIC, 'Oye cómo se dice cada lugar', {
  path: '/mapa',
  title: '¿Dónde está?',
  hint: 'Lleva a la rana por la escuela',
});

export default function EscuelaApp() {
  return (
    <Switch>
      <Route path="/">
        <HomeScreen title="Brincaescuela" Hero={SchoolIcon} options={OPTIONS} className="school--places" />
      </Route>
      <Route path="/descubrir">
        <DiscoverScreen topic={PLACES_TOPIC} />
      </Route>
      <Route path="/leccion">
        <LessonScreen topic={PLACES_TOPIC} />
      </Route>
      <Route path="/mapa">
        <CampusGame topic={PLACES_TOPIC} />
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
