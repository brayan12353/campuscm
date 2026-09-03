import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, ChevronLeft, ChevronRight, ImagePlus, X, CheckCircle2, Tag,
  FileText, MapPin, Eye, Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { APP_CONFIG } from '@/config/app';
import { mockUniversities } from '@/data/mock';
import type { Listing, ListingCategory, ListingCondition } from '@/types';
import { generateId, formatPrice, cn } from '@/utils/format';

const categories: ListingCategory[] = ['Electronics', 'Phones', 'Computers', 'Books', 'Fashion', 'Furniture', 'Accessories', 'School supplies', 'Services', 'Other'];
const conditions: ListingCondition[] = ['New', 'Like New', 'Good', 'Used'];
const conditionLabels: Record<ListingCondition, string> = { New: 'Neuf', 'Like New': 'Comme neuf', Good: 'Bon', 'Used': 'Utilisé' };

const steps = [
  { id: 0, label: 'Catégorie', icon: Tag },
  { id: 1, label: 'Photos', icon: ImagePlus },
  { id: 2, label: 'Informations', icon: FileText },
  { id: 3, label: 'Prix & Lieu', icon: MapPin },
  { id: 4, label: 'Aperçu', icon: Eye },
  { id: 5, label: 'Publier', icon: Send },
];

export function CreateListing() {
  const navigate = useNavigate();
  const { currentUser, addUserListing } = useApp();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    category: '' as ListingCategory | '',
    images: [] as string[],
    title: '',
    description: '',
    condition: '' as ListingCondition | '',
    price: '',
    city: currentUser?.city || 'Douala',
    neighborhood: '',
    university: '',
    campus: '',
    contactMethod: 'app' as 'app' | 'whatsapp',
    contactPhone: '',
  });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const addImage = () => {
    const placeholders = [
      'https://images.pexels.com/photos/3747070/pexels-photo-3747070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/6968164/pexels-photo-6968164.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/5775/calculator-scientific.jpg?auto=compress&cs=tinysrgb&h=650&w=940',
    ];
    setForm((prev) => ({ ...prev, images: [...prev.images, placeholders[prev.images.length % placeholders.length]] }));
  };

  const removeImage = (idx: number) => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 0 && !form.category) errs.category = 'Veuillez choisir une catégorie';
    if (step === 1 && form.images.length === 0) errs.images = 'Ajoutez au moins une photo';
    if (step === 2) {
      if (!form.title) errs.title = 'Le titre est requis';
      if (!form.description) errs.description = 'La description est requise';
      if (!form.condition) errs.condition = "L'état est requis";
    }
    if (step === 3) {
      if (!form.price) errs.price = 'Le prix est requis';
      if (!form.city) errs.city = 'La ville est requise';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 5)); };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handlePublish = () => {
    if (!currentUser) { navigate('/login'); return; }
    const listing: Listing = {
      id: generateId(),
      title: form.title,
      description: form.description,
      price: parseInt(form.price),
      category: form.category as ListingCategory,
      images: form.images,
      condition: form.condition as ListingCondition,
      city: form.city,
      neighborhood: form.neighborhood || undefined,
      university: form.university || undefined,
      campus: form.campus || undefined,
      sellerId: currentUser.id,
      sellerName: currentUser.fullName,
      sellerVerified: currentUser.verification === 'verified',
      contactMethod: form.contactMethod,
      contactPhone: form.contactPhone || undefined,
      createdAt: new Date().toISOString(),
      status: 'pending',
      views: 0,
      saves: 0,
    };
    addUserListing(listing);
    showToast('Annonce créée ! En attente de validation.', 'success');
    navigate('/my-listings');
  };

  const handleSaveDraft = () => {
    showToast('Brouillon enregistré', 'info');
    navigate('/my-listings');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Créer une annonce</h1>
      <p className="text-sm text-gray-500 mb-6">Remplissez les étapes pour publier votre annonce</p>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-all',
                i < step ? 'bg-success-500 text-white' : i === step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400',
              )}>
                {i < step ? <Check size={16} /> : <s.icon size={16} />}
              </div>
              <span className={cn('text-[10px] font-medium hidden sm:block', i === step ? 'text-primary-600' : 'text-gray-400')}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={cn('h-0.5 flex-1 mx-1 rounded transition-colors', i < step ? 'bg-success-500' : 'bg-gray-200')} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 min-h-[300px]">
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="font-semibold text-gray-900 mb-4">Choisir une catégorie</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => update('category', cat)}
                  className={cn(
                    'p-4 rounded-xl border-2 text-sm font-medium transition-all text-center',
                    form.category === cat ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-100 hover:border-primary-300 text-gray-700',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-xs text-error-600 mt-3">{errors.category}</p>}
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="font-semibold text-gray-900 mb-4">Ajouter des photos</h2>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                    <X size={14} />
                  </button>
                  {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">Principale</span>}
                </div>
              ))}
              {form.images.length < 6 && (
                <button onClick={addImage} className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors">
                  <ImagePlus size={24} />
                  <span className="text-[10px] mt-1">Ajouter</span>
                </button>
              )}
            </div>
            {errors.images && <p className="text-xs text-error-600">{errors.images}</p>}
            <p className="text-xs text-gray-400 mt-2">Astuce: Ajoutez jusqu'à 6 photos. La première sera l'image principale.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-semibold text-gray-900">Informations</h2>
            <Input label="Titre" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Ex: HP EliteBook 840 G5" error={errors.title} />
            <Textarea label="Description" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Décrivez votre article..." rows={4} error={errors.description} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">État</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {conditions.map((c) => (
                  <button key={c} onClick={() => update('condition', c)} className={cn('p-2.5 rounded-xl border-2 text-sm font-medium transition-all', form.condition === c ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-100 hover:border-primary-300 text-gray-700')}>
                    {conditionLabels[c]}
                  </button>
                ))}
              </div>
              {errors.condition && <p className="text-xs text-error-600 mt-1">{errors.condition}</p>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-semibold text-gray-900">Prix & Localisation</h2>
            <Input label="Prix (FCFA)" type="number" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="Ex: 95000" error={errors.price} />
            <Select label="Ville" value={form.city} onChange={(e) => update('city', e.target.value)}>
              {APP_CONFIG.cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Input label="Quartier" value={form.neighborhood} onChange={(e) => update('neighborhood', e.target.value)} placeholder="Ex: Akwa" />
            <Select label="Université (optionnel)" value={form.university} onChange={(e) => update('university', e.target.value)}>
              <option value="">Aucune</option>
              {mockUniversities.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
            </Select>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Méthode de contact</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => update('contactMethod', 'app')} className={cn('p-3 rounded-xl border-2 text-sm font-medium transition-all', form.contactMethod === 'app' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-100 text-gray-700')}>
                  Messagerie CampusCM
                </button>
                <button onClick={() => update('contactMethod', 'whatsapp')} className={cn('p-3 rounded-xl border-2 text-sm font-medium transition-all', form.contactMethod === 'whatsapp' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-100 text-gray-700')}>
                  WhatsApp
                </button>
              </div>
            </div>
            {form.contactMethod === 'whatsapp' && (
              <Input label="Numéro WhatsApp" value={form.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} placeholder="+237 6XX XXX XXX" />
            )}
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="font-semibold text-gray-900 mb-4">Aperçu de l'annonce</h2>
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              {form.images[0] && (
                <div className="aspect-[4/3] bg-gray-100">
                  <img src={form.images[0]} alt={form.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{form.title || 'Titre de l\'annonce'}</h3>
                <p className="text-xl font-bold text-primary-600 mb-2">{form.price ? formatPrice(parseInt(form.price)) : 'Prix'}</p>
                <p className="text-sm text-gray-600 mb-3">{form.description || 'Description...'}</p>
                <div className="flex gap-2 flex-wrap text-xs text-gray-500">
                  {form.category && <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{form.category}</span>}
                  {form.condition && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{conditionLabels[form.condition]}</span>}
                  <span>{form.neighborhood || form.city}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-success-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Prêt à publier !</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Votre annonce sera soumise à validation par notre équipe de modération. Vous serez notifié une fois approuvée.
            </p>
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-3 mb-6">
              <p className="text-xs text-warning-800">Mode démonstration: Aucune annonce réelle ne sera publiée.</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        {step > 0 && step < 5 && <Button variant="outline" onClick={prev}><ChevronLeft size={18} /> Précédent</Button>}
        {step < 4 && <Button fullWidth onClick={next}>Suivant <ChevronRight size={18} /></Button>}
        {step === 4 && <Button fullWidth onClick={() => setStep(5)}>Publier <Send size={18} /></Button>}
        {step === 5 && (
          <>
            <Button variant="outline" onClick={handleSaveDraft}>Brouillon</Button>
            <Button fullWidth onClick={handlePublish}><Send size={18} /> Publier l'annonce</Button>
          </>
        )}
      </div>
    </div>
  );
}
