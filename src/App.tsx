import { Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { Redirect, Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { APPS } from './apps/registry';
import { Hub } from './hub/Hub';
import { UpdateToast } from './shared/ui/UpdateToast';

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router hook={useHashLocation}>
        <main className="frame">
          <UpdateToast />
          <Suspense fallback={null}>
            <Switch>
              <Route path="/" component={Hub} />
              {APPS.map((app) => (
                <Route key={app.id} path={app.path} nest>
                  <app.Component />
                </Route>
              ))}
              <Route>
                <Redirect to="/" />
              </Route>
            </Switch>
          </Suspense>
        </main>
      </Router>
    </MotionConfig>
  );
}
