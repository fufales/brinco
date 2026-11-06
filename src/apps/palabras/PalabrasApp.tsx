import { Redirect, Route, Switch } from 'wouter';
import { isScope } from './words';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { LessonScreen } from './screens/LessonScreen';
import { MapScreen } from './screens/MapScreen';
import './palabras.css';

export default function PalabrasApp() {
  return (
    <Switch>
      <Route path="/" component={MapScreen} />
      <Route path="/:scope/descubrir">
        {({ scope }) => (isScope(scope) ? <DiscoverScreen key={scope} scope={scope} /> : <Redirect to="/" />)}
      </Route>
      <Route path="/:scope/leccion">
        {({ scope }) => (isScope(scope) ? <LessonScreen key={scope} scope={scope} /> : <Redirect to="/" />)}
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
