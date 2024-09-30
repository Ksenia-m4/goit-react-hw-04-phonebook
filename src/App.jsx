import { Component } from "react";
import { nanoid } from "nanoid";

import "./App.css";
import Container from "./components/Container/Container";
import ContactForm from "./components/ContactForm/ContactForm";
import ContactList from "./components/ContactList/ContactList";
import ContactFilter from "./components/Filter/ContactFilter";

const LS_KEY = "contacts_list";

class App extends Component {
  state = {
    contacts: [
      { id: "id-1", name: "Rosie Simpson", number: "459-12-56" },
      { id: "id-2", name: "Hermione Kline", number: "443-89-12" },
      { id: "id-3", name: "Eden Clements", number: "645-17-79" },
      { id: "id-4", name: "Annie Copeland", number: "227-91-26" },
    ],
    filter: "",
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem(LS_KEY);
    if (savedContacts) {
      this.setState({ contacts: JSON.parse(savedContacts) });
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem(LS_KEY, JSON.stringify(this.state.contacts));
    }
  }

  addContact = ({ name, number }) => {
    const { contacts } = this.state;

    const duplicateContact = contacts.find(
      (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicateContact) {
      return alert(`${name} is already in contacts`);
    }

    const contact = {
      id: nanoid(),
      name,
      number,
    };

    this.setState((prevstate) => ({
      contacts: [contact, ...prevstate.contacts],
    }));
  };

  deleteContact = (contactId) => {
    this.setState((prevState) => ({
      contacts: prevState.contacts.filter(
        (contact) => contact.id !== contactId
      ),
    }));
  };

  onChangeFilter = (e) => {
    this.setState({ filter: e.target.value });
  };

  getFilteredContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedName = filter.toLowerCase();

    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(normalizedName)
    );
  };

  render() {
    const filteredContacts = this.getFilteredContacts();
    return (
      <>
        <Container>
          <h1 className="Title">Phonebook</h1>
          <ContactForm onSubmit={this.addContact} />

          <h2 className="SubTitle">Contacts</h2>
          <ContactFilter
            value={this.state.filter}
            onChange={this.onChangeFilter}
          />
          <ContactList
            contacts={filteredContacts}
            onDelete={this.deleteContact}
          ></ContactList>
        </Container>
      </>
    );
  }
}

export default App;
