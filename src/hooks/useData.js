import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Fetch all breeds
export function useBreeds() {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('breeds')
      .select('*')
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data) setBreeds(data);
        setLoading(false);
      });
  }, []);

  return { breeds, loading };
}

// Fetch a single breed by slug
export function useBreed(slug) {
  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('breeds')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setBreed(data);
        setLoading(false);
      });
  }, [slug]);

  return { breed, loading };
}

// Fetch animals for a breed (parents or available)
export function useAnimals(breedId, role) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!breedId) return;
    let query = supabase
      .from('animals')
      .select('*, animal_photos(*)')
      .eq('breed_id', breedId)
      .order('sort_order');

    if (role) query = query.eq('role', role);

    query.then(({ data, error }) => {
      if (!error && data) setAnimals(data);
      setLoading(false);
    });
  }, [breedId, role]);

  return { animals, loading };
}

// Fetch upcoming litters for a breed
export function useLitters(breedId) {
  const [litters, setLitters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!breedId) return;
    supabase
      .from('upcoming_litters')
      .select('*')
      .eq('breed_id', breedId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setLitters(data);
        setLoading(false);
      });
  }, [breedId]);

  return { litters, loading };
}

// Submit contact form
export async function submitContact(formData) {
  const { error } = await supabase
    .from('contact_submissions')
    .insert([formData]);
  return { error };
}

// Fetch produce
export function useProduce() {
  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('produce')
      .select('*')
      .eq('available', true)
      .then(({ data, error }) => {
        if (!error && data) setProduce(data);
        setLoading(false);
      });
  }, []);

  return { produce, loading };
}
