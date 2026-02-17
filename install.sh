#!/bin/bash
if ! command -v node &> /dev/null; then
    if command -v brew &> /dev/null; then
        brew install node
    fi
fi
cd engine
python3 -m venv Glide
source Glide/bin/activate
pip install -r requirements.txt
cd ..
npm install
