/** @jsx h */
import { h } from 'hyperapp';
import classy from 'classwrap';

export const LanguageLevel = ({ level }) =>
  <div>
    {level}
    <LevelIcon level={level} from="A1" to="A2" />
    <LevelIcon level={level} from="B1" to="B2" />
    <LevelIcon level={level} from="C1" to="C2" />
  </div>
;

const LevelIcon = ({ level, from, to }) =>
  <i class={classy(['fa fa-fw', { 'fa-star-o': level < from, 'fa-star-half-o': level === from, 'fa-star': level >= to }])}></i>
;
