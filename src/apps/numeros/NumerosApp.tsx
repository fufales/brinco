import { Redirect, Route, Switch } from 'wouter';
import '../../shared/lesson/lesson.css';
import { isNumberScope } from './numbers';
import { FireflyScreen } from './screens/FireflyScreen';
import { LessonScreen } from './screens/LessonScreen';
import { ListenScreen } from './screens/ListenScreen';
import { PondScreen } from './screens/PondScreen';
import './numeros.css';

export default function NumerosApp() {
  return (
    <Switch>
      <Route path="/" component={PondScreen} />
      <Route path="/luciernagas" component={FireflyScreen} />
      <Route path="/:scope/escuchar">
        {({ scope }) => (isNumberScope(scope) ? <ListenScreen key={scope} scope={scope} /> : <Redirect to="/" />)}
      </Route>
      <Route path="/:scope/leccion">
        {({ scope }) => (isNumberScope(scope) ? <LessonScreen key={scope} scope={scope} /> : <Redirect to="/" />)}
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
