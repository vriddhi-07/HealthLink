<script>
    let healthadvices = [
        ["Stay Hydrated"," Drink plenty of water throughout the day to stay properly hydrated."],["Balanced Diet"," Maintain a balanced diet rich in fruits, vegetables, whole grains, and lean proteins."],["Regular Exercise"," Aim for at least 30 minutes of moderate exercise most days of the week."],["Adequate Sleep"," Ensure you get 7-9 hours of sleep every night to allow your body to rest and rejuvenate."],["Manage Stress"," Practice relaxation techniques like meditation, deep breathing, or yoga to manage stress levels."],["Limit Processed Foods"," Minimize your intake of processed foods, sugary drinks, and fast food."],["Regular Health Check-ups"," Schedule regular check-ups with your healthcare provider for preventive care."],["Quit Smoking"," If you smoke, seek help to quit. Smoking can lead to various health issues."],["Limit Alcohol Intake"," If you drink alcohol, do so in moderation. Limit intake to recommended guidelines."],["Wear Sunscreen"," Protect your skin from harmful UV rays by wearing sunscreen with SPF 30 or higher."],["Hand Hygiene"," Wash your hands frequently to prevent the spread of germs and infections."],["Stay Socially Connected"," Maintain social connections with friends and family for emotional well-being."],["Limit Caffeine"," Limit your intake of caffeine, especially in the afternoon and evening, to improve sleep quality."],["Mindful Eating"," Pay attention to what and how much you eat. Avoid distractions while eating to prevent overeating."],["Practice Gratitude"," Cultivate a positive outlook on life. Practice gratitude to boost mental and emotional health."],["Stay Active"," Avoid prolonged periods of sitting. Take short breaks and stretch if you have a desk job."],["Cultivate Hobbies"," Engage in hobbies or activities that bring you joy and relaxation."],["Practice Mindfulness"," Be present in the moment. Mindfulness can reduce stress and improve overall well-being."],["Laugh and Have Fun"," Laughter is a great stress reliever. Engage in activities that make you happy and bring joy."]
    ]
    let a = healthadvices[parseInt(Math.random()*19)]
</script>

<div id = "healthtip">
    <span style="font-size: small;">Health Advice of the Day</span>
    <h2>{a[0]}</h2>
    <span>{a[1]}</span>
</div>
<style>
    #healthtip {
        color: black;
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 10px;
        cursor:pointer;
        margin:10px;
        align-items: center;
        background-color:aliceblue;
        border:1px solid black;
    }
</style>