const fs = require('fs');
const path = require('path');

module.exports = async function(context) {
  const skillPath = path.join(__dirname, 'skills/socratic-thinking/SKILL.md');
  const skill = fs.readFileSync(skillPath, 'utf8');
  return [
    { role: 'system', content: skill },
    { role: 'user', content: context.vars.message }
  ];
};
