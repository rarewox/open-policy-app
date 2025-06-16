import { View, Text, Animated, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RepresentativeCardDetail from './cards/RepresentativeCardDetail';
import RepresentativeCardSummary from './cards/RepresentativeCardSummary';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRepresentativeContext } from '../../context/RepresentativeContext';
import RepRecentActivities from './activities/RepRecentActivities';
import RepIssuesRaised from './activities/RepIssuesRaised';

const representatives = [
  {
    id: '1',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '2',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
  {
    id: '3',
    name: 'Species at Risk Act (SARA)',
    role: 'Summary of the issue, Summary of the issue,Summary of the issue, Summary of the issue Summary of the issue',
    date: '2023-09-20',
  },
];

const RepresentativeSection = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { screen, scrolledPastThreshold } = useRepresentativeContext();

  return (
    <>
      {!scrolledPastThreshold ? ( // Minimal Header Initially
        <RepresentativeCardDetail />
      ) : (
        <RepresentativeCardSummary />
      )}

      {/* Scrollable Content */}
      {(screen === 1 || screen === 4) && <RepRecentActivities />}
      {(screen === 2 || screen === 5) && <RepIssuesRaised />}
    </>
  );
};

export default RepresentativeSection;
