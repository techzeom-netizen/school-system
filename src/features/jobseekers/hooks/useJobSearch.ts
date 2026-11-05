import { useState } from 'react';
import { jobs } from '../data/jobs';

const useJobSearch = (personalized = false) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [workModes, setWorkModes] = useState<string[]>(
    personalized ? ['Remote'] : []
  );
  const [experiences, setExperiences] = useState<string[]>(
    personalized ? ['2-5 years'] : []
  );

  const filteredJobs = jobs.filter(job => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      [job.title, job.company, job.description, ...job.skills]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    const matchesLocation =
      !normalizedLocation ||
      job.location.toLowerCase().includes(normalizedLocation);
    const matchesMode =
      workModes.length === 0 || workModes.includes(job.workMode);
    const matchesExperience =
      experiences.length === 0 ||
      experiences.some(range => {
        if (range === '10+ years') {
          return Number(job.experience.split('-')[0]) >= 10;
        }

        const [min, max] = range
          .split('-')
          .map(value => Number.parseFloat(value));
        const jobMin = Number(job.experience.split('-')[0]);

        return Number.isFinite(max) ? jobMin >= min && jobMin <= max : false;
      });

    return matchesQuery && matchesLocation && matchesMode && matchesExperience;
  });

  const clearFilters = () => {
    setQuery('');
    setLocation('');
    setWorkModes([]);
    setExperiences([]);
  };

  const toggleWorkMode = (value: string, checked: boolean) => {
    setWorkModes(current =>
      checked
        ? [...current, value]
        : current.filter(workMode => workMode !== value)
    );
  };

  const toggleExperience = (value: string, checked: boolean) => {
    setExperiences(current =>
      checked
        ? [...current, value]
        : current.filter(experience => experience !== value)
    );
  };

  return {
    query,
    setQuery,
    location,
    setLocation,
    workModes,
    experiences,
    filteredJobs,
    clearFilters,
    toggleWorkMode,
    toggleExperience,
  };
};

export default useJobSearch;
