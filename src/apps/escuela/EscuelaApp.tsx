import { Redirect, Route, Switch } from 'wouter';
import '../../shared/lesson/lesson.css';
import { CampusGame } from './CampusGame';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LessonScreen } from './screens/LessonScreen';
import { PEOPLE_TOPIC, PLACES_TOPIC } from './topics';
import './escuela.css';

/** Cada pantalla lleva `key` por tema: sin ella, pasar de lugares a personas reusaría la partida anterior. */
export default function EscuelaApp() {
  return (
    <Switch>
      <Route path="/" component={HomeScreen} />
      <Route path="/descubrir">
        <DiscoverScreen key={PLACES_TOPIC.id} topic={PLACES_TOPIC} />
      </Route>
      <Route path="/leccion">
        <LessonScreen key={PLACES_TOPIC.id} topic={PLACES_TOPIC} />
      </Route>
      <Route path="/mapa">
        <CampusGame key={PLACES_TOPIC.id} topic={PLACES_TOPIC} />
      </Route>
      <Route path="/personas/descubrir">
        <DiscoverScreen key={PEOPLE_TOPIC.id} topic={PEOPLE_TOPIC} />
      </Route>
      <Route path="/personas/leccion">
        <LessonScreen key={PEOPLE_TOPIC.id} topic={PEOPLE_TOPIC} />
      </Route>
      <Route path="/personas/quien">
        <CampusGame key={PEOPLE_TOPIC.id} topic={PEOPLE_TOPIC} />
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
