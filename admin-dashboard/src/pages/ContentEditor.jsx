import { useState, useEffect, useCallback } from 'react';
import {
  Save,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  GripVertical,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const AccordionPanel = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">{children}</div>}
    </div>
  );
};

const ArrayField = ({ label, items, onChange, fields, itemLabel = (i) => `Item ${i + 1}` }) => {
  const handleItemChange = (index, field, value) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleAdd = () => {
    const empty = {};
    fields.forEach((f) => {
      if (f.type === 'array') empty[f.key] = [];
      else if (f.type === 'number') empty[f.key] = 0;
      else empty[f.key] = '';
    });
    onChange([...items, empty]);
  };

  const handleRemove = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        <Button type="button" variant="ghost" icon={Plus} onClick={handleAdd} className="text-xs px-2 py-1">
          Add
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{itemLabel(index)}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {fields.map((field) => (
            <div key={field.key}>
              {field.type === 'textarea' ? (
                <FormInput
                  label={field.label}
                  textarea
                  rows={field.rows || 3}
                  value={item[field.key] || ''}
                  onChange={(e) => handleItemChange(index, field.key, e.target.value)}
                />
              ) : field.type === 'number' ? (
                <FormInput
                  label={field.label}
                  type="number"
                  value={item[field.key] ?? 0}
                  onChange={(e) => handleItemChange(index, field.key, Number(e.target.value))}
                />
              ) : field.type === 'array' ? (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{field.label}</label>
                  <input
                    className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder={field.placeholder || 'Comma-separated values'}
                    value={Array.isArray(item[field.key]) ? item[field.key].join(', ') : ''}
                    onChange={(e) =>
                      handleItemChange(index, field.key, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
                    }
                  />
                </div>
              ) : (
                <FormInput
                  label={field.label}
                  value={item[field.key] || ''}
                  onChange={(e) => handleItemChange(index, field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-sm text-gray-400 italic text-center py-4">No items yet. Click "Add" to create one.</p>
      )}
    </div>
  );
};

const SocialLinksEditor = ({ links, onChange }) => {
  const handleChange = (index, field, value) => {
    const updated = links.map((link, i) => (i === index ? { ...link, [field]: value } : link));
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...links, { platform: '', url: '' }]);
  };

  const handleRemove = (index) => {
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Social Links</label>
        <Button type="button" variant="ghost" icon={Plus} onClick={handleAdd} className="text-xs px-2 py-1">Add</Button>
      </div>
      {links.map((link, index) => (
        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="flex-1 space-y-2">
            <input
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Platform (e.g. GitHub)"
              value={link.platform}
              onChange={(e) => handleChange(index, 'platform', e.target.value)}
            />
            <input
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="URL (e.g. https://github.com/username)"
              value={link.url}
              onChange={(e) => handleChange(index, 'url', e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      {links.length === 0 && (
        <p className="text-sm text-gray-400 italic text-center py-4">No social links yet.</p>
      )}
    </div>
  );
};

const SKILL_FIELDS = [
  { key: 'name', label: 'Skill Name', type: 'text' },
  { key: 'level', label: 'Proficiency (0-100)', type: 'number' },
];

const TESTIMONIAL_FIELDS = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'company', label: 'Company', type: 'text' },
  { key: 'image', label: 'Image URL', type: 'text' },
  { key: 'rating', label: 'Rating (1-5)', type: 'number' },
  { key: 'feedback', label: 'Feedback', type: 'textarea' },
];

const EXPERIENCE_ITEM_FIELDS = [
  { key: 'role', label: 'Role / Title', type: 'text' },
  { key: 'company', label: 'Company', type: 'text' },
  { key: 'duration', label: 'Duration', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'tags', label: 'Tags', type: 'array', placeholder: 'React, Node.js, MongoDB' },
  { key: 'bullets', label: 'Bullet Points', type: 'array', placeholder: 'Achieved X, Built Y, Led Z' },
  { key: 'logo', label: 'Logo URL', type: 'text' },
];

const STAT_FIELDS = [
  { key: 'label', label: 'Label', type: 'text' },
  { key: 'value', label: 'Value', type: 'number' },
  { key: 'suffix', label: 'Suffix (e.g. +)', type: 'text' },
];

const ContentEditor = () => {
  const { showToast } = useToast();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/content');
      if (res.success) {
        setContent(res.data);
      }
    } catch (err) {
      showToast('Failed to load content: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateField = (section, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateNestedField = (section, nested, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nested]: { ...prev[section]?.[nested], [field]: value },
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/api/content', content);
      showToast('Content saved successfully!');
    } catch (err) {
      showToast('Failed to save: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="font-bold">Unable to load content data.</p>
        <Button onClick={fetchContent} className="mt-4">Retry</Button>
      </div>
    );
  }

  const { hero, about, skills, experience, testimonials, socialLinks, resume, contactInfo } = content;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Content Editor</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all portfolio sections from one place.</p>
        </div>
        <Button onClick={handleSave} loading={saving} icon={Save}>Save All Changes</Button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
        {/* Hero Section */}
        <AccordionPanel title="Hero Section" defaultOpen>
          <FormInput label="Greeting" value={hero?.greeting || ''} onChange={(e) => updateField('hero', 'greeting', e.target.value)} />
          <FormInput label="Name" value={hero?.name || ''} onChange={(e) => updateField('hero', 'name', e.target.value)} />
          <FormInput label="Image URL" value={hero?.image || ''} onChange={(e) => updateField('hero', 'image', e.target.value)} />
          <FormInput label="Description" textarea rows={3} value={hero?.description || ''} onChange={(e) => updateField('hero', 'description', e.target.value)} />
          <ArrayField
            label="Typewriter Titles"
            items={hero?.titles?.map((t) => ({ value: t })) || []}
            onChange={(arr) => updateField('hero', 'titles', arr.map((a) => a.value))}
            fields={[{ key: 'value', label: 'Title', type: 'text' }]}
            itemLabel={(i) => `Title ${i + 1}`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Primary CTA Text</label>
              <input className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={hero?.cta?.primary?.text || ''} onChange={(e) => updateNestedField('hero', 'cta', 'primary', { ...hero.cta?.primary, text: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Primary CTA Link</label>
              <input className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={hero?.cta?.primary?.link || ''} onChange={(e) => updateNestedField('hero', 'cta', 'primary', { text: hero.cta?.primary?.text || '', link: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Secondary CTA Text</label>
              <input className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={hero?.cta?.secondary?.text || ''} onChange={(e) => updateNestedField('hero', 'cta', 'secondary', { ...hero.cta?.secondary, text: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Secondary CTA Link</label>
              <input className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={hero?.cta?.secondary?.link || ''} onChange={(e) => updateNestedField('hero', 'cta', 'secondary', { text: hero.cta?.secondary?.text || '', link: e.target.value })} />
            </div>
          </div>
        </AccordionPanel>

        {/* About Section */}
        <AccordionPanel title="About Section" defaultOpen>
          <FormInput label="Title" value={about?.title || ''} onChange={(e) => updateField('about', 'title', e.target.value)} />
          <FormInput label="Subtitle" value={about?.subtitle || ''} onChange={(e) => updateField('about', 'subtitle', e.target.value)} />
          <FormInput label="Description" textarea rows={4} value={about?.description || ''} onChange={(e) => updateField('about', 'description', e.target.value)} />
          <FormInput label="Image URL" value={about?.image || ''} onChange={(e) => updateField('about', 'image', e.target.value)} />
          <ArrayField label="Stats" items={about?.stats || []} onChange={(arr) => updateField('about', 'stats', arr)} fields={STAT_FIELDS} itemLabel={(i) => `Stat ${i + 1}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="CTA Text" value={about?.cta?.text || ''} onChange={(e) => updateField('about', 'cta', { ...about.cta, text: e.target.value })} />
            <FormInput label="CTA Link" value={about?.cta?.link || ''} onChange={(e) => updateField('about', 'cta', { text: about.cta?.text || '', link: e.target.value })} />
          </div>
        </AccordionPanel>

        {/* Skills Section */}
        <AccordionPanel title="Skills Section">
          <FormInput label="Section Title" value={skills?.title || ''} onChange={(e) => updateField('skills', 'title', e.target.value)} />
          <FormInput label="Section Subtitle" textarea rows={2} value={skills?.subtitle || ''} onChange={(e) => updateField('skills', 'subtitle', e.target.value)} />
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Categories</label>
            {skills?.categories?.map((cat, ci) => (
              <div key={ci} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{cat.name || `Category ${ci + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = skills.categories.filter((_, i) => i !== ci);
                      updateField('skills', 'categories', updated);
                    }}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <FormInput
                  label="Category Name"
                  value={cat.name || ''}
                  onChange={(e) => {
                    const updated = skills.categories.map((c, i) => (i === ci ? { ...c, name: e.target.value } : c));
                    updateField('skills', 'categories', updated);
                  }}
                />
                <ArrayField
                  label="Skills"
                  items={cat.items || []}
                  onChange={(arr) => {
                    const updated = skills.categories.map((c, i) => (i === ci ? { ...c, items: arr } : c));
                    updateField('skills', 'categories', updated);
                  }}
                  fields={SKILL_FIELDS}
                  itemLabel={(i) => cat.items?.[i]?.name || `Skill ${i + 1}`}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              icon={Plus}
              onClick={() => {
                const updated = [...(skills?.categories || []), { name: '', items: [] }];
                updateField('skills', 'categories', updated);
              }}
            >
              Add Category
            </Button>
          </div>
        </AccordionPanel>

        {/* Experience Section */}
        <AccordionPanel title="Experience Section">
          <FormInput label="Section Title" value={experience?.title || ''} onChange={(e) => updateField('experience', 'title', e.target.value)} />
          <FormInput label="Section Subtitle" textarea rows={2} value={experience?.subtitle || ''} onChange={(e) => updateField('experience', 'subtitle', e.target.value)} />
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Categories</label>
            {experience?.categories?.map((cat, ci) => (
              <div key={ci} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{cat.name || `Category ${ci + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = experience.categories.filter((_, i) => i !== ci);
                      updateField('experience', 'categories', updated);
                    }}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <FormInput
                  label="Category Name"
                  value={cat.name || ''}
                  onChange={(e) => {
                    const updated = experience.categories.map((c, i) => (i === ci ? { ...c, name: e.target.value } : c));
                    updateField('experience', 'categories', updated);
                  }}
                />
                <ArrayField
                  label="Items"
                  items={cat.items || []}
                  onChange={(arr) => {
                    const updated = experience.categories.map((c, i) => (i === ci ? { ...c, items: arr } : c));
                    updateField('experience', 'categories', updated);
                  }}
                  fields={EXPERIENCE_ITEM_FIELDS}
                  itemLabel={(i) => cat.items?.[i]?.role || `Item ${i + 1}`}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              icon={Plus}
              onClick={() => {
                const updated = [...(experience?.categories || []), { name: '', items: [] }];
                updateField('experience', 'categories', updated);
              }}
            >
              Add Category
            </Button>
          </div>
        </AccordionPanel>

        {/* Testimonials Section */}
        <AccordionPanel title="Testimonials Section">
          <FormInput label="Section Title" value={testimonials?.title || ''} onChange={(e) => updateField('testimonials', 'title', e.target.value)} />
          <FormInput label="Section Subtitle" value={testimonials?.subtitle || ''} onChange={(e) => updateField('testimonials', 'subtitle', e.target.value)} />
          <ArrayField
            label="Testimonials"
            items={testimonials?.items || []}
            onChange={(arr) => updateField('testimonials', 'items', arr)}
            fields={TESTIMONIAL_FIELDS}
            itemLabel={(i) => testimonials?.items?.[i]?.name || `Testimonial ${i + 1}`}
          />
        </AccordionPanel>

        {/* Social Links Section */}
        <AccordionPanel title="Social Links">
          <SocialLinksEditor
            links={socialLinks || []}
            onChange={(arr) => setContent((prev) => ({ ...prev, socialLinks: arr }))}
          />
        </AccordionPanel>

        {/* Resume Section */}
        <AccordionPanel title="Resume">
          <FormInput label="Title" value={resume?.title || ''} onChange={(e) => updateField('resume', 'title', e.target.value)} />
          <FormInput label="Resume URL" value={resume?.url || ''} onChange={(e) => updateField('resume', 'url', e.target.value)} />
          <FormInput label="Button Text" value={resume?.buttonText || ''} onChange={(e) => updateField('resume', 'buttonText', e.target.value)} />
        </AccordionPanel>

        {/* Contact Info Section */}
        <AccordionPanel title="Contact Information">
          <FormInput label="Email" type="email" value={contactInfo?.email || ''} onChange={(e) => updateField('contactInfo', 'email', e.target.value)} />
          <FormInput label="Phone" value={contactInfo?.phone || ''} onChange={(e) => updateField('contactInfo', 'phone', e.target.value)} />
          <FormInput label="Location" value={contactInfo?.location || ''} onChange={(e) => updateField('contactInfo', 'location', e.target.value)} />
          <FormInput label="Form Title" value={contactInfo?.formTitle || ''} onChange={(e) => updateField('contactInfo', 'formTitle', e.target.value)} />
          <FormInput label="Form Description" textarea rows={2} value={contactInfo?.formDescription || ''} onChange={(e) => updateField('contactInfo', 'formDescription', e.target.value)} />
          <FormInput label="Form Button Text" value={contactInfo?.formButtonText || ''} onChange={(e) => updateField('contactInfo', 'formButtonText', e.target.value)} />
          <FormInput label="Success Message" value={contactInfo?.successMessage || ''} onChange={(e) => updateField('contactInfo', 'successMessage', e.target.value)} />
        </AccordionPanel>

        <div className="flex justify-end pt-4 pb-8">
          <Button type="submit" loading={saving} icon={Save} className="px-8 py-3 text-lg">
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContentEditor;
