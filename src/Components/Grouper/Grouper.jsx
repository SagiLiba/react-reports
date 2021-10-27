import { useMemo, useState } from 'react';

export const Grouper = ({ children, firstElementsOnly = false, groupEvery = 0, groupProps = {} }) => {
  const getUniqueKey = () => 'id-' + Date.now() + (Math.random(0, 10) * 10000000).toFixed(0);

  const groupFirstElements = () => {
    const groupedChildren = children.slice(0, groupEvery);
    const restOfChildren = children.slice(groupEvery);

    return [
      <div key={getUniqueKey()} {...groupProps}>
        {groupedChildren}
      </div>,
      ...restOfChildren,
    ];
  };

  const groupEveryXElements = () => {
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

  const groupElements = () => {
    let all = [];
    if (firstElementsOnly && groupEvery) {
      all = groupFirstElements();
    }
    if (!firstElementsOnly && groupEvery) {
      all = groupEveryXElements();
    }
    return all;
  };

  const elements = useMemo(groupElements, [children, firstElementsOnly, groupEvery, groupProps]);

  return elements;
};

export const GrouperFunction = ({ children, firstElementsOnly = false, groupEvery = 0, groupProps = {} }) => {
  const getUniqueKey = () => 'id-' + Date.now() + (Math.random(0, 10) * 10000000).toFixed(0);

  const groupFirstElements = () => {
    const groupedChildren = children.slice(0, groupEvery);
    const restOfChildren = children.slice(groupEvery);

    return [
      <div key={getUniqueKey()} {...groupProps}>
        {groupedChildren}
      </div>,
      ...restOfChildren,
    ];
  };

  const groupEveryXElements = () => {
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

  const groupElements = () => {
    let all = [];
    if (firstElementsOnly && groupEvery) {
      all = groupFirstElements();
    }
    if (!firstElementsOnly && groupEvery) {
      all = groupEveryXElements();
    }
    return all;
  };

  const elements = groupElements();

  return elements;
};
