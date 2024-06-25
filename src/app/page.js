'use client';

import { useState, useEffect } from 'react';
import { genreOptions } from '@/constants/genres';
import magazinesData from '@/data/fake_mags_data.json';

const Home = () => {
  const [magazines, setMagazines] = useState([]);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const fetchMagazines = async () => {
      const data = magazinesData;

      const today = new Date();
      const nextSunday = new Date(today);
      nextSunday.setDate(today.getDate() + (7 - today.getDay()));

      const filteredMagazines = data.filter(magazine => {
        if (magazine.readingPeriods && magazine.readingPeriods.length > 0) {
          const deadline = new Date(magazine.readingPeriods[0].deadline.$date);
          return deadline >= today && deadline <= nextSunday;
        }
        return false;
      });

      setMagazines(filteredMagazines);
    };

    fetchMagazines();
  }, []);

  const generateHTML = () => {
    let html = '<h1>Last Chance to Submit</h1>';
    magazines.forEach(magazine => {
      const genres = magazine.genres.map(genre => genreOptions.find(option => option.id === genre.id)?.label || genre.value).join(', ');
      const deadline = new Date(magazine.readingPeriods[0].deadline.$date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      const country = magazine.country || 'Unknown country';
      const yearFounded = magazine.yearFounded || 'Unknown year';
  
      html += `
        <div>
          <br/>
          <h2>${magazine.name} | Deadline: ${deadline}${magazine.currentTheme ? ` | Theme: ${magazine.currentTheme}` : ''}</h2>
          <br/>
          <p>${country}-based literary magazine founded in ${yearFounded} that publishes ${genres}.</p>
          <br/>
          <p><i>${magazine.description}</i></p>
          <br/>
          <p>${magazine.simultaneousSubmissions ? 'Accept' : 'Do not accept'} simultaneous submissions. Respond within ${magazine.responseDays || 'unspecified'} days.</p>
          <br/>
          <br/>
        </div>
      `;
    });
    setHtmlContent(html);
  };
  

  const downloadHTML = () => {
    const element = document.createElement('a');
    const file = new Blob([htmlContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'LastChanceToSubmit.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div>
      <button onClick={generateHTML}>Generate List</button>
      <button onClick={downloadHTML}>Download List</button>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default Home;