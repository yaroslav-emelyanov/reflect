import { FC, createElement } from 'react';
import { Store } from 'effector';

import { reflectFactory } from './reflect';

import {
  BindByProps,
  Hooks,
  PropsByBind,
  ReflectCreatorContext,
  View,
} from './types';

export function matchFactory(context: ReflectCreatorContext) {
  const reflect = reflectFactory(context);

  return function match<
    Props,
    Variant extends string,
    Bind extends BindByProps<Props>
  >(config: {
    source: Store<Variant>;
    bind: Bind;
    cases: Record<Variant, View<Props>>;
    hooks?: Hooks;
    default?: View<Props>;
  }): FC<PropsByBind<Props, Bind>> {
    function View(props: Props) {
      const nameOfCase = context.useStore(config.source);
      const Component = config.cases[nameOfCase] ?? config.default;

      return createElement(Component, props);
    }

    return reflect({
      bind: config.bind,
      view: View,
      hooks: config.hooks,
    });
  };
}
