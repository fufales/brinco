import { Redirect, Route, Switch } from 'wouter';
import '../../shared/lesson/lesson.css';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LessonScreen } from './screens/LessonScreen';
import { MapScreen } from './screens/MapScreen';
import './escuela.css';

export default function EscuelaApp() {
  return (
    <Switch>
      <Route path="/" component={HomeScreen} />
      <Route path="/descubrir" component={DiscoverScreen} />
      <Route path="/leccion" component={LessonScreen} />
      <Route path="/mapa" component={MapScreen} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
