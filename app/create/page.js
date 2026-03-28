'use client';
import { useState } from 'react';

export default function CreateMarketPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Crypto');
  const [type, setType] = useState('binary');
  const [outcomes, setOutcomes] = useState(['Yes', 'No']);
  const [endDate, setEndDate] = useState('');
  const [liquidity, setLiquidity] = useState(1000);
  const [submitted, setSubmitted] = useState(false);

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'binary') setOutcomes(['Yes', 'No']);
    else if (newType === 'multiple') setOutcomes(['Option 1', 'Option 2', 'Option 3']);
    else setOutcomes(['Low', 'Medium', 'High']);
  };

  const addOutcome = () => {
    if (outcomes.length < 10) setOutcomes([...outcomes, `Option ${outcomes.length + 1}`]);
  };

  const removeOutcome = (idx) => {
    if (outcomes.length > 2) setOutcomes(outcomes.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="create-page">
      <h1>Create a Market</h1>
      <p>Launch a new prediction market and let the crowd forecast the outcome.</p>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label>Market Question</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Will Bitcoin exceed $200,000 by 2027?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Resolution Criteria</label>
          <textarea
            className="form-textarea"
            placeholder="Describe exactly how this market will be resolved..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Category & Type */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {['Crypto', 'Sports', 'Technology', 'Economy', 'Science', 'Entertainment', 'Politics', 'World Events'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Market Type</label>
            <select className="form-select" value={type} onChange={(e) => handleTypeChange(e.target.value)}>
              <option value="binary">Binary (Yes / No)</option>
              <option value="multiple">Multiple Choice</option>
              <option value="scalar">Scalar / Range</option>
            </select>
          </div>
        </div>

        {/* Outcomes */}
        <div className="form-group">
          <label>Outcomes</label>
          <div className="outcomes-list">
            {outcomes.map((outcome, idx) => (
              <div key={idx} className="outcome-input-row">
                <input
                  type="text"
                  className="form-input"
                  value={outcome}
                  onChange={(e) => {
                    const newOutcomes = [...outcomes];
                    newOutcomes[idx] = e.target.value;
                    setOutcomes(newOutcomes);
                  }}
                />
                {outcomes.length > 2 && (
                  <button type="button" className="remove-outcome" onClick={() => removeOutcome(idx)}>×</button>
                )}
              </div>
            ))}
            {type !== 'binary' && outcomes.length < 10 && (
              <button type="button" className="add-outcome-btn" onClick={addOutcome}>
                + Add Outcome
              </button>
            )}
          </div>
        </div>

        {/* End Date & Liquidity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="datetime-local"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Initial Liquidity ($)</label>
            <input
              type="number"
              className="form-input"
              value={liquidity}
              onChange={(e) => setLiquidity(e.target.value)}
              min="100"
              required
            />
          </div>
        </div>

        {/* Funding Source */}
        <div className="form-group">
          <label>Funding Source</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="outcome-option selected" style={{ flex: 1, cursor: 'pointer' }}>
              <span className="outcome-option-name">Play Money</span>
              <span style={{ fontSize: '12px', color: 'var(--green)' }}>$10,000 available</span>
            </div>
            <div className="outcome-option" style={{ flex: 1, cursor: 'pointer' }}>
              <span className="outcome-option-name">Crypto (ETH)</span>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Connect wallet</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ marginTop: '16px' }}>
          {submitted ? '✓ Market Created Successfully!' : 'Create Market'}
        </button>

        {submitted && (
          <div style={{
            marginTop: '16px', padding: '16px', background: 'var(--green-bg)',
            border: '1px solid var(--green-border)', borderRadius: 'var(--radius-sm)',
            textAlign: 'center', color: 'var(--green)', fontSize: '14px'
          }}>
            Your market has been created and is now live! <a href="/" style={{ color: 'var(--green)', textDecoration: 'underline' }}>View Markets</a>
          </div>
        )}
      </form>
    </div>
  );
}
