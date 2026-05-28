-- Add sample bank details data
INSERT INTO bank_details (bank_name, account_number, branch_name, ifsc_code, micr_code, bank_photo_url) VALUES
('State Bank of India', '30123456789', 'Delhi Main Branch', 'SBIN0000001', '110002001', NULL),
('HDFC Bank', '50987654321', 'Connaught Place', 'HDFC0000002', '110240002', NULL),
('ICICI Bank', '60111222333', 'Karol Bagh', 'ICIC0000003', '110240003', NULL),
('Punjab National Bank', '40555666777', 'Rajouri Garden', 'PUNB0000004', '110063004', NULL),
('Axis Bank', '70888999000', 'Nehru Place', 'UTIB0000005', '110019005', NULL),
('Bank of Baroda', '80121314151', 'Lajpat Nagar', 'BARB0000006', '110024006', NULL),
('Canara Bank', '90161718192', 'Khan Market', 'CNRB0000007', '110003007', NULL),
('Union Bank of India', '11202122232', 'Sarojini Nagar', 'UBIN0000008', '110023008', NULL),
('Central Bank of India', '33242526272', 'Green Park', 'CBIN0000009', '110016009', NULL),
('Indian Bank', '44282930313', 'Laxmi Nagar', 'IDIB0000010', '110092010', NULL),
('Bank of Maharashtra', '55323334353', 'Janakpuri', 'MAHB0000011', '110058011', NULL),
('Kotak Mahindra Bank', '66363738394', 'Pitampura', 'KKBK0000012', '110034012', NULL),
('Yes Bank', '77404142434', 'Rohini', 'YESB0000013', '110085013', NULL),
('IndusInd Bank', '88444546474', 'Dwarka', 'INDB0000014', '110077014', NULL),
('Federal Bank', '99484950515', 'Vasant Kunj', 'FDRL0000015', '110070015', NULL);

-- Enable realtime for bank_details
ALTER PUBLICATION supabase_realtime ADD TABLE bank_details;