# app.py
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    # Serve the main HTML page
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_campaign():
    # Gather form data
    brand_name = request.form.get('brandName', '').strip()
    what_you_sell = request.form.get('whatYouSell', '').strip()
    target_audience = request.form.get('targetAudience', '').strip()
    campaign_goals = request.form.get('campaignGoal', '').strip()
    platforms = request.form.get('platforms', '').strip()

    # Validate inputs
    if not all([brand_name, what_you_sell, target_audience, campaign_goals, platforms]):
        error_message = "Please fill in all the fields."
        return render_template('form.html', error=error_message)

    # Prepare data to pass to the template
    form_data = {
        'brandName': brand_name,
        'whatYouSell': what_you_sell,
        'targetAudience': target_audience,
        'campaignGoals': campaign_goals,
        'platforms': platforms
    }

    print(form_data)

    # Render the generate.html template and pass the form data
    return render_template('generate.html', form_data=form_data)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
