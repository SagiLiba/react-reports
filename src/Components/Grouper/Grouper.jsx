import { useMemo, useState } from 'react';

const getUniqueKey = () => 'id-' + Date.now() + (Math.random(0, 10) * 10000000).toFixed(0);

const groupFirstElements = ({ children, groupEvery, groupProps }) => {
  const groupedChildren = children.slice(0, groupEvery);
  const restOfChildren = children.slice(groupEvery);

  return [
    <div key={getUniqueKey()} {...groupProps}>
      {groupedChildren}
    </div>,
    ...restOfChildren,
  ];
};

const groupEveryXElements = ({ children, groupEvery, groupProps }) => {
  let groups = [];
  let tempGroup = [];

  // Group every x elements
  for (let i = 0; i < children.length; i++) {
    if (i % groupEvery === 0 && i !== 0) {
      groups.push(
        <div key={getUniqueKey()} {...groupProps}>
          {tempGroup}
        </div>
      );
      tempGroup = [];
    }
    tempGroup.push(children[i]);
  }

  // Group left over elements
  if (tempGroup.length > 0) {
    groups.push(
      <div key={getUniqueKey()} {...groupProps}>
        {tempGroup}
      </div>
    );
  }

  return groups;
};

const groupElements = ({ children, firstElementsOnly, groupEvery, groupProps }) => {
  let all = [];
  if (firstElementsOnly && groupEvery) {
    all = groupFirstElements({ children, groupEvery, groupProps });
  }
  if (!firstElementsOnly && groupEvery) {
    all = groupEveryXElements({ children, groupEvery, groupProps });
  }
  return all;
};

export const Grouper = ({ children, firstElementsOnly = false, groupEvery = 0, groupProps = {} }) => {
  const elements = useMemo(groupElements({ children, firstElementsOnly, groupEvery, groupProps }), [
    children,
    firstElementsOnly,
    groupEvery,
    groupProps,
  ]);
  return elements;
};

export const GrouperFunction = ({ children, firstElementsOnly = false, groupEvery = 0, groupProps = {} }) => {
  const elements = groupElements({ children, firstElementsOnly, groupEvery, groupProps });
  return elements;
};
